import React from "react";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Search, Filter, ArrowUpDown, FileSpreadsheet, Package, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { safeJsonParse, formatRupiah } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Katalog Pengadaan Barang (Supplier)",
  description:
    "Katalog lengkap pengadaan barang industri, IT, mekanikal, elektrikal, genset diesel, dan alat keselamatan K3 bergaransi resmi.",
};

interface ProductsPageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    sort?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const search = params.search || "";
  const selectedCategory = params.category || "";
  const sort = params.sort || "newest";

  // Build where filter
  const where: any = { isPublished: true };
  if (selectedCategory) {
    where.category = { slug: selectedCategory };
  }
  if (search) {
    where.OR = [
      { title: { contains: search } },
      { sku: { contains: search } },
      { brand: { contains: search } },
      { shortDesc: { contains: search } },
    ];
  }

  // Build orderBy
  let orderBy: any = { createdAt: "desc" };
  if (sort === "name_asc") orderBy = { title: "asc" };
  if (sort === "name_desc") orderBy = { title: "desc" };
  if (sort === "price_asc") orderBy = { price: "asc" };
  if (sort === "price_desc") orderBy = { price: "desc" };

  const [categories, products] = await Promise.all([
    prisma.category.findMany({
      where: { type: "PRODUCT" },
      orderBy: { sortOrder: "asc" },
      include: {
        _count: {
          select: { products: { where: { isPublished: true } } },
        },
      },
    }),
    prisma.product.findMany({
      where,
      include: { category: true },
      orderBy,
    }),
  ]);

  return (
    <div className="bg-corporate-light-gray min-h-screen py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Page Title & Breadcrumb */}
        <div className="space-y-2">
          <Badge variant="gold">Katalog Pengadaan</Badge>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-corporate-navy tracking-tight">
            Katalog Produk & Peralatan Pengadaan
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 max-w-2xl">
            Jelajahi portofolio produk original dari distributor dan prinsipal terpercaya. Kami melayani permintaan satuan korporasi hingga pengadaan volume besar (tender/lelang).
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
          {/* Search Form */}
          <form method="GET" action="/produk" className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="search"
              defaultValue={search}
              placeholder="Cari nama produk, SKU, atau brand..."
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-corporate-blue/20 focus:border-corporate-blue"
            />
            {selectedCategory && <input type="hidden" name="category" value={selectedCategory} />}
            {sort && <input type="hidden" name="sort" value={sort} />}
          </form>

          {/* Sort Selector */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5" />
              Urutkan:
            </span>
            <form method="GET" action="/produk" className="inline-block">
              {search && <input type="hidden" name="search" value={search} />}
              {selectedCategory && <input type="hidden" name="category" value={selectedCategory} />}
              <select
                name="sort"
                defaultValue={sort}
                onChange={(e) => e.target.form?.submit()}
                className="text-xs sm:text-sm py-2 px-3 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-corporate-blue/20"
              >
                <option value="newest">Terbaru</option>
                <option value="name_asc">Nama (A - Z)</option>
                <option value="name_desc">Nama (Z - A)</option>
              </select>
            </form>
          </div>
        </div>

        {/* Main Content Layout: Sidebar Filter + Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Category Filter Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-3">
              <h3 className="font-bold text-sm text-corporate-navy uppercase tracking-wider flex items-center gap-2 border-b border-gray-100 pb-3">
                <Filter className="w-4 h-4 text-corporate-blue" />
                Kategori Produk
              </h3>

              <div className="space-y-1">
                <Link
                  href="/produk"
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    !selectedCategory
                      ? "bg-corporate-navy text-white font-semibold"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <span>Semua Kategori</span>
                </Link>

                {categories.map((cat) => {
                  const isActive = selectedCategory === cat.slug;
                  return (
                    <Link
                      key={cat.id}
                      href={`/produk?category=${cat.slug}${search ? `&search=${search}` : ""}`}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                        isActive
                          ? "bg-corporate-navy text-white font-semibold"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <span className="line-clamp-1">{cat.name}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                          isActive ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {cat._count.products}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Procurement RFQ Assistance Box */}
            <div className="bg-gradient-to-br from-corporate-navy to-corporate-blue text-white p-5 rounded-xl shadow-corporate space-y-3">
              <div className="w-8 h-8 rounded-lg bg-corporate-gold text-corporate-navy flex items-center justify-center font-bold">
                <FileSpreadsheet className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-sm text-white">Butuh Spesifikasi Khusus?</h4>
              <p className="text-xs text-gray-300 leading-relaxed">
                Jika produk yang Anda cari belum tercantum di katalog, kirimkan daftar BoQ atau ToR Anda langsung ke tim procurement kami.
              </p>
              <Link href="/rfq" className="block pt-1">
                <Button variant="gold" size="sm" className="w-full text-xs font-bold uppercase tracking-wider">
                  Minta Penawaran Bebas
                </Button>
              </Link>
            </div>
          </div>

          {/* Product Cards Grid */}
          <div className="lg:col-span-3">
            {products.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto">
                  <Package className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-base text-corporate-navy">Tidak ada produk ditemukan</h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  Coba kata kunci lain atau pilih kategori berbeda. Anda juga dapat langsung mengajukan RFQ untuk produk custom.
                </p>
                <div className="pt-2">
                  <Link href="/produk">
                    <Button variant="outline" size="sm">
                      Reset Filter
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((prod) => {
                  const images = safeJsonParse<string[]>(prod.images, []);
                  const firstImage = images[0] || "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80";

                  return (
                    <Card key={prod.id} hoverEffect className="flex flex-col justify-between">
                      <div>
                        <div className="relative h-44 w-full bg-gray-100 overflow-hidden">
                          <Image
                            src={firstImage}
                            alt={prod.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                            <Badge variant="gold" size="sm">
                              {prod.category.name}
                            </Badge>
                            <Badge
                              variant={prod.availability === "READY_STOCK" ? "success" : "warning"}
                              size="sm"
                            >
                              {prod.availability === "READY_STOCK" ? "Ready Stock" : prod.availability}
                            </Badge>
                          </div>
                        </div>

                        <div className="p-4 space-y-2">
                          <p className="text-[11px] font-mono text-gray-400">SKU: {prod.sku}</p>
                          <h3 className="font-bold text-sm text-corporate-navy line-clamp-2 hover:text-corporate-blue transition-colors">
                            <Link href={`/produk/${prod.slug}`}>{prod.title}</Link>
                          </h3>
                          <p className="text-xs text-gray-600 line-clamp-2">
                            {prod.shortDesc}
                          </p>
                        </div>
                      </div>

                      <div className="p-4 pt-0 border-t border-gray-50 flex items-center justify-between gap-2 mt-2">
                        <div>
                          <p className="text-[10px] text-gray-400 uppercase font-semibold">Harga</p>
                          <p className="text-xs font-bold text-corporate-navy">
                            {prod.showPrice ? formatRupiah(prod.price) : "Hubungi Kami"}
                          </p>
                        </div>
                        <div className="flex gap-1.5">
                          <Link href={`/produk/${prod.slug}`}>
                            <Button variant="outline" size="sm" className="text-xs px-2.5 py-1">
                              Detail
                            </Button>
                          </Link>
                          <Link href={`/rfq?item=${encodeURIComponent(prod.title)}`}>
                            <Button variant="gold" size="sm" className="text-xs px-2.5 py-1 font-semibold">
                              RFQ
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

