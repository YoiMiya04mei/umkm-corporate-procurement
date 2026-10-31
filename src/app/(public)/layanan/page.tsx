import React from "react";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Wrench, CheckCircle2, ArrowRight, MessageSquare, ShieldCheck, Network, Building2, FileSpreadsheet } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { safeJsonParse } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Layanan Jasa & Pemeliharaan (Service Provider)",
  description:
    "Layanan teknis profesional: instalasi fiber optic, data center, mekanikal & elektrikal M&E, maintenance genset, dan konsultasi pengadaan.",
};

export default async function ServicesPage() {
  const [categories, services] = await Promise.all([
    prisma.category.findMany({
      where: { type: "SERVICE" },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.service.findMany({
      where: { isPublished: true },
      include: { category: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="bg-corporate-light-gray min-h-screen py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="space-y-3">
          <Badge variant="gold">Layanan Jasa Terpadu</Badge>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-corporate-navy tracking-tight">
            Layanan Kontraktor & Pemeliharaan Fasilitas
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 max-w-2xl">
            Solusi pengerjaan teknis bersertifikasi untuk menunjang infrastruktur bisnis, pemeliharaan genset, jaringan telekomunikasi data center, dan konsultasi manajemen pengadaan.
          </p>
        </div>

        {/* Services List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((srv) => {
            const scopeItems = safeJsonParse<string[]>(srv.scopeOfWork, []);
            const images = safeJsonParse<string[]>(srv.images, []);
            const thumbnail =
              images[0] ||
              "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80";

            return (
              <Card key={srv.id} hoverEffect className="flex flex-col justify-between">
                <div>
                  <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
                    <Image src={thumbnail} alt={srv.title} fill className="object-cover" />
                    <div className="absolute inset-0 bg-corporate-navy/40" />
                    <div className="absolute top-3 left-3">
                      <Badge variant="blue" size="sm">
                        {srv.category.name}
                      </Badge>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <h3 className="font-bold text-base text-corporate-navy line-clamp-2 hover:text-corporate-blue transition-colors">
                      <Link href={`/layanan/${srv.slug}`}>{srv.title}</Link>
                    </h3>
                    <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                      {srv.shortDesc}
                    </p>

                    <div className="pt-2 border-t border-gray-100 space-y-1.5">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-corporate-navy">
                        Ruang Lingkup Pekerjaan:
                      </p>
                      {scopeItems.slice(0, 3).map((item, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 text-xs text-gray-600">
                          <CheckCircle2 className="w-3.5 h-3.5 text-corporate-gold shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-gray-50 flex justify-between items-center mt-3">
                  <Link href={`/layanan/${srv.slug}`}>
                    <Button variant="outline" size="sm" className="text-xs">
                      Alur Kerja
                    </Button>
                  </Link>
                  <Link href={`/rfq?item=${encodeURIComponent(srv.title)}&type=JASA`}>
                    <Button variant="gold" size="sm" className="text-xs font-semibold">
                      Konsultasi Jasa
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Consultation Callout */}
        <div className="bg-gradient-to-r from-corporate-navy-dark to-corporate-blue text-white rounded-2xl p-8 sm:p-10 shadow-corporate flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-bold">
              Membutuhkan Tim Pelaksana Jasa untuk Proyek Anda?
            </h3>
            <p className="text-xs sm:text-sm text-gray-300">
              Tim engineering kami siap melakukan site survey lapangan dan menyusun estimasi Rencana Anggaran Biaya (RAB) teknis secara komprehensif.
            </p>
          </div>
          <Link href="/rfq?type=JASA" className="shrink-0">
            <Button variant="gold" size="md" className="font-bold uppercase tracking-wider text-xs">
              Minta Proposal Teknis (RFQ)
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

