import React from "react";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Briefcase, MapPin, Calendar, ArrowRight, Building2, Layers } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { safeJsonParse } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Portofolio Proyek & Rekam Jejak Pengadaan",
  description:
    "Dokumentasi proyek pengadaan barang dan layanan jasa yang telah diselesaikan dengan sukses oleh PT Mitra Karya Pratama.",
};

interface PortfolioPageProps {
  searchParams: Promise<{
    category?: string;
  }>;
}

export default async function PortfolioPage({ searchParams }: PortfolioPageProps) {
  const params = await searchParams;
  const selectedCategory = params.category || "";

  const where: any = { isPublished: true };
  if (selectedCategory) {
    where.category = { slug: selectedCategory };
  }

  const [categories, portfolios] = await Promise.all([
    prisma.category.findMany({
      where: { type: "PORTFOLIO" },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.portfolio.findMany({
      where,
      include: { category: true },
      orderBy: { completionYear: "desc" },
    }),
  ]);

  return (
    <div className="bg-corporate-light-gray min-h-screen py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="space-y-3">
          <Badge variant="gold">Rekam Jejak Pekerjaan</Badge>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-corporate-navy tracking-tight">
            Portofolio Pengadaan & Proyek Selesai
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 max-w-2xl">
            Bukti nyata kapabilitas kami dalam menangani proyek pengadaan berskala kecil hingga besar, baik pada sektor korporasi swasta (B2B) maupun instansi pemerintah (B2G).
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-4">
          <Link
            href="/portofolio"
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              !selectedCategory
                ? "bg-corporate-navy text-white shadow-sm"
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            Semua Proyek
          </Link>
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.slug;
            return (
              <Link
                key={cat.id}
                href={`/portofolio?category=${cat.slug}`}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-corporate-navy text-white shadow-sm"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                }`}
              >
                {cat.name}
              </Link>
            );
          })}
        </div>

        {/* Portfolio Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolios.map((item) => {
            const images = safeJsonParse<string[]>(item.images, []);
            const thumb =
              images[0] ||
              "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80";

            return (
              <Card key={item.id} hoverEffect className="flex flex-col justify-between">
                <div>
                  <div className="relative h-52 w-full bg-gray-100 overflow-hidden">
                    <Image src={thumb} alt={item.title} fill className="object-cover" />
                    <div className="absolute top-3 left-3">
                      <Badge variant="blue" size="sm">
                        {item.category.name}
                      </Badge>
                    </div>
                    <div className="absolute bottom-3 right-3 bg-corporate-navy/90 text-corporate-gold text-[11px] font-mono font-bold px-2.5 py-1 rounded">
                      Tahun {item.completionYear}
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <div className="space-y-1">
                      <p className="text-xs text-corporate-gold font-semibold flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5" />
                        {item.clientName}
                      </p>
                      <p className="text-[11px] text-gray-500 flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        {item.location}
                      </p>
                    </div>

                    <h3 className="font-bold text-base text-corporate-navy line-clamp-2 hover:text-corporate-blue transition-colors">
                      <Link href={`/portofolio/${item.slug}`}>{item.title}</Link>
                    </h3>

                    <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                      {item.shortDesc}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-gray-50 flex justify-between items-center mt-3">
                  <span className="text-xs text-emerald-600 font-semibold">
                    &bull; Serah Terima 100%
                  </span>
                  <Link href={`/portofolio/${item.slug}`}>
                    <Button variant="ghost" size="sm" className="text-xs">
                      Detail Pekerjaan
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
