import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  FileSpreadsheet,
  CheckCircle2,
  ShieldCheck,
  Truck,
  ArrowLeft,
  MessageSquare,
  Package,
  Layers,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { safeJsonParse, formatRupiah, getWhatsAppUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface ProductDetailProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductDetailProps) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!product) return { title: "Produk Tidak Ditemukan" };

  return {
    title: `${product.title} | Katalog Pengadaan`,
    description: product.shortDesc,
    openGraph: {
      title: product.title,
      description: product.shortDesc,
    },
  };
}

export default async function ProductDetailPage({ params }: ProductDetailProps) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!product || !product.isPublished) {
    notFound();
  }

  // Increment view counter
  await prisma.product
    .update({
      where: { id: product.id },
      data: { views: { increment: 1 } },
    })
    .catch(() => {});

  const settings = await prisma.companySetting.findUnique({
    where: { id: "default" },
  });

  const images = safeJsonParse<string[]>(product.images, []);
  const mainImage = images[0] || "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80";

  const specs = safeJsonParse<{ key: string; value: string }[]>(
    product.specifications,
    []
  );

  // Fetch related products
  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
      isPublished: true,
    },
    take: 3,
  });

  const whatsappNumber = settings?.whatsapp || "6281234567890";
  const waConsultMessage = `Halo ${settings?.name || "PT Mitra Karya Pratama"}, saya tertarik dengan produk *${product.title}* (SKU: ${product.sku}). Mohon info penawaran harga resmi dan ketersediaan stoknya. Terima kasih.`;

  return (
    <div className="bg-corporate-light-gray min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb Back Link */}
        <div>
          <Link
            href="/produk"
            className="inline-flex items-center text-xs font-semibold text-corporate-navy hover:text-corporate-blue transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Kembali ke Katalog Pengadaan
          </Link>
        </div>

        {/* Product Overview Section */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-corporate p-6 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left: Product Images Gallery */}
            <div className="lg:col-span-5 space-y-4">
              <div className="relative h-72 sm:h-96 w-full rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
                <Image
                  src={mainImage}
                  alt={product.title}
                  fill
                  priority
                  className="object-cover"
                />
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  <Badge variant="gold">{product.category.name}</Badge>
                  <Badge
                    variant={product.availability === "READY_STOCK" ? "success" : "warning"}
                  >
                    {product.availability === "READY_STOCK" ? "Ready Stock" : product.availability}
                  </Badge>
                </div>
              </div>

              {/* Thumbnails if multiple */}
              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {images.map((imgUrl, idx) => (
                    <div
                      key={idx}
                      className="relative w-20 h-20 rounded-lg overflow-hidden border-2 border-gray-200 shrink-0"
                    >
                      <Image src={imgUrl} alt={`Thumbnail ${idx + 1}`} fill className="object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Info & Procurement Action */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-xs text-gray-500 font-mono">
                  <span>SKU: {product.sku}</span>
                  {product.brand && (
                    <>
                      <span>&bull;</span>
                      <span className="text-corporate-blue font-semibold">Brand: {product.brand}</span>
                    </>
                  )}
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-corporate-navy tracking-tight leading-snug">
                  {product.title}
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {product.shortDesc}
                </p>
              </div>

              {/* Pricing Box */}
              <div className="p-4 rounded-xl bg-corporate-light-gray border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] text-gray-500 uppercase tracking-wider font-semibold">
                    Estimasi Harga Satuan
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-corporate-navy mt-0.5">
                    {product.showPrice ? formatRupiah(product.price) : "Hubungi Kami (RFQ)"}
                  </p>
                  {!product.showPrice && (
                    <p className="text-[11px] text-gray-500">
                      *Harga B2B bersifat fleksibel menyesuaikan volume pesanan & lokasi serah terima.
                    </p>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <Link href={`/rfq?item=${encodeURIComponent(product.title)}&type=BARANG`}>
                    <Button variant="gold" size="md" className="w-full sm:w-auto font-bold uppercase tracking-wider text-xs shadow-gold">
                      <FileSpreadsheet className="w-4 h-4 mr-1.5" />
                      Minta Penawaran Harga (RFQ)
                    </Button>
                  </Link>
                  <a
                    href={getWhatsAppUrl(whatsappNumber, waConsultMessage)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Button variant="outline" size="md" className="w-full sm:w-auto text-xs">
                      <MessageSquare className="w-4 h-4 mr-1.5 text-emerald-600" />
                      Chat WhatsApp
                    </Button>
                  </a>
                </div>
              </div>

              {/* B2B Assurance Points */}
              <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-gray-700">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-corporate-gold shrink-0" />
                  <span>Garansi Resmi Prinsipal</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Faktur Pajak & Berkas Lengkap</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-corporate-blue shrink-0" />
                  <span>Pengiriman Seluruh Indonesia</span>
                </div>
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>Tersedia untuk Pengadaan Tender</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Specifications & Description Tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Specs & Description */}
          <div className="lg:col-span-8 space-y-6">
            {/* Technical Specifications Table */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-4">
              <h3 className="text-lg font-bold text-corporate-navy border-b border-gray-100 pb-3 flex items-center gap-2">
                <Package className="w-5 h-5 text-corporate-blue" />
                Spesifikasi Teknis
              </h3>

              {specs.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs sm:text-sm text-left">
                    <tbody className="divide-y divide-gray-100">
                      {specs.map((item, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? "bg-corporate-light-gray/40" : "bg-white"}>
                          <td className="py-2.5 px-4 font-semibold text-corporate-navy w-1/3">
                            {item.key}
                          </td>
                          <td className="py-2.5 px-4 text-gray-700">
                            {item.value}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-xs text-gray-500">
                  Spesifikasi teknis standar tersedia. Hubungi sales engineer kami untuk datasheet lengkap.
                </p>
              )}
            </div>

            {/* Product Description */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-4">
              <h3 className="text-lg font-bold text-corporate-navy border-b border-gray-100 pb-3">
                Deskripsi Lengkap & Aplikasi Produk
              </h3>
              <div className="text-xs sm:text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {product.description}
              </div>
            </div>
          </div>

          {/* Right Sidebar: Related Products */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
              <h3 className="font-bold text-sm text-corporate-navy uppercase tracking-wider border-b border-gray-100 pb-3">
                Produk Terkait
              </h3>

              {relatedProducts.length > 0 ? (
                <div className="space-y-4">
                  {relatedProducts.map((rel) => {
                    const relImages = safeJsonParse<string[]>(rel.images, []);
                    const relThumb = relImages[0] || "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80";

                    return (
                      <Link
                        key={rel.id}
                        href={`/produk/${rel.slug}`}
                        className="group flex gap-3 items-center p-2 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                          <Image src={relThumb} alt={rel.title} fill className="object-cover" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-corporate-navy line-clamp-1 group-hover:text-corporate-blue">
                            {rel.title}
                          </p>
                          <p className="text-[11px] text-gray-500 font-mono">SKU: {rel.sku}</p>
                          <span className="text-[11px] text-corporate-gold font-semibold">
                            Lihat Detail &rarr;
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-gray-400">Tidak ada produk terkait lainnya.</p>
              )}
            </div>

            {/* Quick Quotation Card */}
            <div className="bg-corporate-navy text-white rounded-2xl p-6 space-y-3">
              <h4 className="font-bold text-base text-corporate-gold">Butuh Penawaran Resmi?</h4>
              <p className="text-xs text-gray-300 leading-relaxed">
                Kami menerbitkan Surat Penawaran Harga (SPH) lengkap dengan syarat pembayaran, waktu serah terima, dan faktur pajak.
              </p>
              <Link href={`/rfq?item=${encodeURIComponent(product.title)}&type=BARANG`} className="block pt-2">
                <Button variant="gold" size="sm" className="w-full text-xs font-bold uppercase tracking-wider">
                  Isi Formulir RFQ
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

