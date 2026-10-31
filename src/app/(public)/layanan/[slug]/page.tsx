import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  Wrench,
  CheckCircle2,
  ShieldCheck,
  ArrowLeft,
  MessageSquare,
  FileSpreadsheet,
  Clock,
  ArrowRight,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { safeJsonParse, getWhatsAppUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface ServiceDetailProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ServiceDetailProps) {
  const { slug } = await params;
  const service = await prisma.service.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!service) return { title: "Layanan Tidak Ditemukan" };

  return {
    title: `${service.title} | Layanan Jasa`,
    description: service.shortDesc,
  };
}

export default async function ServiceDetailPage({ params }: ServiceDetailProps) {
  const { slug } = await params;

  const service = await prisma.service.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!service || !service.isPublished) {
    notFound();
  }

  const settings = await prisma.companySetting.findUnique({
    where: { id: "default" },
  });

  const scopeList = safeJsonParse<string[]>(service.scopeOfWork, []);
  const processSteps = safeJsonParse<{ step: number; title: string; desc: string }[]>(
    service.processSteps,
    []
  );
  const advantages = safeJsonParse<string[]>(service.advantages, []);
  const images = safeJsonParse<string[]>(service.images, []);
  const mainImage =
    images[0] ||
    "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1000&q=80";

  const whatsappNumber = settings?.whatsapp || "6281234567890";
  const waConsultMessage = `Halo ${settings?.name || "PT Mitra Karya Pratama"}, saya ingin berkonsultasi mengenai layanan *${service.title}*. Mohon informasi ketersediaan jadwal survey dan penawaran biayanya.`;

  return (
    <div className="bg-corporate-light-gray min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Back link */}
        <div>
          <Link
            href="/layanan"
            className="inline-flex items-center text-xs font-semibold text-corporate-navy hover:text-corporate-blue transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Kembali ke Daftar Layanan
          </Link>
        </div>

        {/* Hero Section of Service Detail */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-corporate overflow-hidden">
          <div className="relative h-64 sm:h-80 w-full bg-corporate-navy">
            <Image src={mainImage} alt={service.title} fill className="object-cover opacity-60" priority />
            <div className="absolute inset-0 bg-gradient-to-t from-corporate-navy via-corporate-navy/40 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 space-y-2">
              <Badge variant="gold">{service.category.name}</Badge>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                {service.title}
              </h1>
              <p className="text-xs sm:text-sm text-gray-200 max-w-3xl leading-relaxed">
                {service.shortDesc}
              </p>
            </div>
          </div>
        </div>

        {/* 2 Columns: Main Details + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-8 space-y-8">
            {/* Description */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-4">
              <h2 className="text-lg font-bold text-corporate-navy border-b border-gray-100 pb-3">
                Deskripsi Layanan & Metodologi Kerja
              </h2>
              <div className="text-xs sm:text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {service.description}
              </div>
            </div>

            {/* Scope of Work */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-4">
              <h2 className="text-lg font-bold text-corporate-navy border-b border-gray-100 pb-3">
                Ruang Lingkup Pekerjaan (Scope of Work)
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {scopeList.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 p-3 rounded-lg bg-corporate-light-gray/60 border border-gray-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-xs text-gray-700 font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Workflow Process Steps */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-6">
              <h2 className="text-lg font-bold text-corporate-navy border-b border-gray-100 pb-3">
                Tahapan Alur Pelaksanaan Proyek
              </h2>
              <div className="space-y-4">
                {processSteps.map((step, idx) => (
                  <div key={idx} className="flex gap-4 items-start">
                    <div className="w-9 h-9 rounded-full bg-corporate-blue text-white font-bold flex items-center justify-center shrink-0 text-sm shadow-sm">
                      {step.step || idx + 1}
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-sm text-corporate-navy">{step.title}</h4>
                      <p className="text-xs text-gray-600 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Advantages */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-4">
              <h2 className="text-lg font-bold text-corporate-navy border-b border-gray-100 pb-3">
                Keunggulan Layanan Kami
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {advantages.map((adv, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 p-3 rounded-lg bg-corporate-gold-light border border-corporate-gold/20">
                    <ShieldCheck className="w-4 h-4 text-corporate-gold-hover shrink-0" />
                    <span className="text-xs font-semibold text-corporate-navy">{adv}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Action Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Consultation Card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
              <h3 className="font-bold text-sm text-corporate-navy uppercase tracking-wider border-b border-gray-100 pb-3">
                Konsultasi & Penawaran
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Ingin tim teknisi kami menjadwalkan survey lapangan ke lokasi proyek Anda? Ajukan permintaan penawaran harga resmi (RFQ) sekarang.
              </p>

              <div className="space-y-2 pt-2">
                <Link href={`/rfq?item=${encodeURIComponent(service.title)}&type=JASA`} className="block">
                  <Button variant="gold" size="md" className="w-full text-xs font-bold uppercase tracking-wider shadow-gold">
                    <FileSpreadsheet className="w-4 h-4 mr-1.5" />
                    Minta Penawaran Teknis (RFQ)
                  </Button>
                </Link>
                <a
                  href={getWhatsAppUrl(whatsappNumber, waConsultMessage)}
                  target="_blank"
                  rel="noreferrer"
                  className="block"
                >
                  <Button variant="outline" size="md" className="w-full text-xs">
                    <MessageSquare className="w-4 h-4 mr-1.5 text-emerald-600" />
                    Konsultasi via WhatsApp
                  </Button>
                </a>
              </div>
            </div>

            {/* SLA & Service Standards */}
            <div className="bg-corporate-navy text-white rounded-2xl p-6 space-y-4">
              <h4 className="font-bold text-sm text-corporate-gold uppercase tracking-wider">
                Standar Kepatuhan K3 & Mutu
              </h4>
              <ul className="space-y-2.5 text-xs text-gray-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-corporate-gold shrink-0" />
                  <span>Teknisi Tersertifikasi Resmi</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-corporate-gold shrink-0" />
                  <span>APD Lapangan Lengkap Sesuai SMK3</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-corporate-gold shrink-0" />
                  <span>As-Built Drawing & BAST Resmi</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-corporate-gold shrink-0" />
                  <span>Masa Garansi Retensi 12 Bulan</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
