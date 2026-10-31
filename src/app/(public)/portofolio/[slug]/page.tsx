import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  ArrowLeft,
  Building2,
  MapPin,
  Calendar,
  CheckCircle2,
  FileSpreadsheet,
  Layers,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { safeJsonParse } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface PortfolioDetailProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PortfolioDetailProps) {
  const { slug } = await params;
  const item = await prisma.portfolio.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!item) return { title: "Portofolio Tidak Ditemukan" };

  return {
    title: `${item.title} | Portofolio Proyek`,
    description: item.shortDesc,
  };
}

export default async function PortfolioDetailPage({ params }: PortfolioDetailProps) {
  const { slug } = await params;

  const item = await prisma.portfolio.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!item || !item.isPublished) {
    notFound();
  }

  const images = safeJsonParse<string[]>(item.images, []);
  const mainImage =
    images[0] ||
    "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80";

  return (
    <div className="bg-corporate-light-gray min-h-screen py-8 sm:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <Link
            href="/portofolio"
            className="inline-flex items-center text-xs font-semibold text-corporate-navy hover:text-corporate-blue transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Kembali ke Semua Portofolio
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-corporate overflow-hidden">
          <div className="relative h-72 sm:h-96 w-full bg-corporate-navy">
            <Image src={mainImage} alt={item.title} fill className="object-cover" priority />
            <div className="absolute inset-0 bg-gradient-to-t from-corporate-navy via-transparent to-transparent opacity-90" />
            <div className="absolute bottom-6 left-6 right-6 space-y-2">
              <Badge variant="gold">{item.category.name}</Badge>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {item.title}
              </h1>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* Project Quick Meta Box */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-corporate-light-gray border border-gray-200 text-xs">
              <div className="space-y-1">
                <span className="text-gray-400 font-semibold uppercase text-[10px]">Nama Klien:</span>
                <p className="font-bold text-corporate-navy flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-corporate-blue" />
                  {item.clientName}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-gray-400 font-semibold uppercase text-[10px]">Lokasi Pekerjaan:</span>
                <p className="font-bold text-corporate-navy flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-corporate-gold" />
                  {item.location}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-gray-400 font-semibold uppercase text-[10px]">Tahun Penyelesaian:</span>
                <p className="font-bold text-corporate-navy flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  Tahun {item.completionYear} (Serah Terima 100%)
                </p>
              </div>
            </div>

            {/* Scope & Description */}
            <div className="space-y-3">
              <h3 className="text-base font-bold text-corporate-navy border-b border-gray-100 pb-2">
                Rincian Pelaksanaan Pekerjaan
              </h3>
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {item.description}
              </p>
            </div>

            {/* Photo Documentation Gallery */}
            {images.length > 1 && (
              <div className="space-y-3 pt-4 border-t border-gray-100">
                <h3 className="text-sm font-bold text-corporate-navy uppercase tracking-wider">
                  Dokumentasi Foto Lapangan
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {images.map((imgUrl, idx) => (
                    <div key={idx} className="relative h-44 rounded-xl overflow-hidden border border-gray-200">
                      <Image src={imgUrl} alt={`Dokumentasi ${idx + 1}`} fill className="object-cover hover:scale-105 transition-transform duration-300" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Procurement CTA Box */}
            <div className="p-6 rounded-xl bg-corporate-navy text-white flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
              <div className="space-y-1 text-center sm:text-left">
                <p className="text-sm font-bold text-corporate-gold">
                  Tertarik Mengadakan Proyek Serupa?
                </p>
                <p className="text-xs text-gray-300">
                  Konsultasikan spesifikasi teknis dan dapatkan estimasi anggaran resmi dari tim kami.
                </p>
              </div>
              <Link href={`/rfq?item=${encodeURIComponent(item.title)}`}>
                <Button variant="gold" size="sm" className="font-bold uppercase tracking-wider text-xs">
                  <FileSpreadsheet className="w-4 h-4 mr-1.5" />
                  Minta Penawaran
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
