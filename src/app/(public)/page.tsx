import React from "react";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import {
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  FileSpreadsheet,
  Award,
  Clock,
  ThumbsUp,
  Layers,
  Wrench,
  Server,
  Zap,
  Truck,
  Building2,
  Star,
  Quote,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import { safeJsonParse, formatRupiah } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  // Fetch dynamic data from database
  const [settings, categories, featuredProducts, services, portfolios, articles, testimonials, partners] =
    await Promise.all([
      prisma.companySetting.findUnique({ where: { id: "default" } }),
      prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
      prisma.product.findMany({
        where: { isPublished: true, isFeatured: true },
        include: { category: true },
        take: 6,
      }),
      prisma.service.findMany({
        where: { isPublished: true, isFeatured: true },
        include: { category: true },
        take: 4,
      }),
      prisma.portfolio.findMany({
        where: { isPublished: true, isFeatured: true },
        include: { category: true },
        take: 3,
      }),
      prisma.article.findMany({
        where: { isPublished: true },
        include: { category: true },
        orderBy: { publishedAt: "desc" },
        take: 3,
      }),
      prisma.testimonial.findMany({
        where: { isPublished: true },
        orderBy: { sortOrder: "asc" },
        take: 3,
      }),
      prisma.clientPartner.findMany({
        orderBy: { sortOrder: "asc" },
        take: 6,
      }),
    ]);

  const companyName = settings?.name || "PT MITRA KARYA PRATAMA";
  const tagline = settings?.tagline || "Solusi Terpercaya Pengadaan Barang dan Layanan Jasa Terpadu";

  const statProjects = settings?.statProjects ?? 185;
  const statClients = settings?.statClients ?? 92;
  const statProducts = settings?.statProducts ?? 450;
  const statYears = settings?.statYears ?? 8;

  const corePillars = [
    {
      icon: ShieldCheck,
      title: "Profesional & Berlisensi",
      desc: "Legalitas lengkap (NIB, NPWP, Akta, Sertifikat K3) siap memenuhi standar kualifikasi vendor tender Anda.",
    },
    {
      icon: TrendingUp,
      title: "Harga Kompetitif & Transparan",
      desc: "Penawaran harga terbaik langsung dari jaringan prinsipal dan distributor resmi dengan rincian biaya terbuka.",
    },
    {
      icon: Award,
      title: "Kualitas Berstandar SNI / ISO",
      desc: "Menjamin setiap barang asli 100% dan setiap pengerjaan jasa lolos uji mutu serta quality control ketat.",
    },
    {
      icon: Clock,
      title: "Pengiriman Tepat Waktu (On-Time SLA)",
      desc: "Manajemen logistik terjadwal untuk memastikan pasokan material tiba di lokasi proyek tanpa menghambat operasional.",
    },
    {
      icon: ThumbsUp,
      title: "Pelayanan Responsif 24/7",
      desc: "Tim sales engineer dan customer relation siap melayani konsultasi teknis serta penerbitan SPH dalam 1x24 jam.",
    },
    {
      icon: Layers,
      title: "Komitmen Kemitraan Jangka Panjang",
      desc: "Dukungan purna jual, ketersediaan suku cadang berkelanjutan, dan jaminan masa garansi resmi pabrikan.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="relative bg-gradient-to-br from-corporate-navy-dark via-corporate-navy to-corporate-blue text-white overflow-hidden py-20 lg:py-28">
        {/* Decorative Grid Lines */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#C8A96B_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-corporate-blue/60 border border-corporate-gold/40 text-corporate-gold text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
                <ShieldCheck className="w-4 h-4" />
                Mitra Resmi Pengadaan B2B & B2G
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Mitra Terpercaya Pengadaan{" "}
                <span className="text-corporate-gold underline decoration-corporate-gold/50 decoration-wavy">
                  Barang & Layanan Jasa
                </span>{" "}
                Perusahaan Anda
              </h1>

              <p className="text-sm sm:text-base text-gray-300 max-w-2xl leading-relaxed">
                {tagline}. Kami mendistribusikan perlengkapan industri, perangkat IT & jaringan, kelistrikan M&E, serta jasa pemeliharaan fasilitas berstandar mutu tinggi untuk efisiensi bisnis Anda.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link href="/rfq" className="w-full sm:w-auto">
                  <Button
                    variant="gold"
                    size="lg"
                    className="w-full sm:w-auto font-bold tracking-wider uppercase text-xs sm:text-sm shadow-gold"
                  >
                    <FileSpreadsheet className="w-4 h-4 mr-2" />
                    Minta Penawaran (RFQ)
                  </Button>
                </Link>
                <Link href="/produk" className="w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto text-white border-white/20 hover:bg-white/10"
                  >
                    Lihat Katalog Produk
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 border-t border-white/10 grid grid-cols-3 gap-4 text-center lg:text-left">
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-corporate-gold">{statProjects}+</p>
                  <p className="text-[11px] text-gray-400">Proyek Selesai</p>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-corporate-gold">{statClients}+</p>
                  <p className="text-[11px] text-gray-400">Klien Korporasi</p>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-corporate-gold">{statYears} Thn</p>
                  <p className="text-[11px] text-gray-400">Pengalaman</p>
                </div>
              </div>
            </div>

            {/* Right Visual Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-corporate-gold/30 bg-corporate-navy-light/80 p-2">
                <div className="relative h-72 sm:h-96 w-full rounded-xl overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80"
                    alt="Corporate Procurement & Service Operations"
                    fill
                    priority
                    className="object-cover hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-corporate-navy via-transparent to-transparent opacity-80" />

                  {/* Floating Feature Pill */}
                  <div className="absolute bottom-4 left-4 right-4 bg-corporate-navy/90 backdrop-blur-md p-4 rounded-xl border border-corporate-gold/30 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-corporate-gold font-bold uppercase tracking-wider">
                        Kecepatan Respon
                      </p>
                      <p className="text-sm font-semibold text-white">
                        SLA Penawaran SPH ≤ 1x24 Jam
                      </p>
                    </div>
                    <Link href="/kontak">
                      <Button variant="gold" size="sm" className="text-xs">
                        Hubungi Tim
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. COMPANY INTRODUCTION SECTION */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-4">
              <Badge variant="blue">Profil Perusahaan</Badge>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-corporate-navy tracking-tight leading-snug">
                Penyedia Solusi Rantai Pasok Terpadu untuk Sektor Bisnis & Instansi
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                {settings?.description ||
                  "PT Mitra Karya Pratama berdedikasi menjadi rekanan strategis yang dapat diandalkan dalam memenuhi seluruh spektrum kebutuhan operasional perusahaan, mulai dari penyediaan unit mesin berat, perangkat IT dan jaringan, sistem elektrikal, hingga penyediaan perlengkapan keselamatan kerja."}
              </p>
              <div className="pt-2">
                <Link href="/tentang-kami">
                  <Button variant="primary" size="md">
                    Selengkapnya Tentang Kami
                    <ChevronRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card hoverEffect className="p-5 border-l-4 border-l-corporate-blue">
                <div className="w-10 h-10 rounded-lg bg-corporate-blue-light text-corporate-blue flex items-center justify-center mb-3">
                  <Truck className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-corporate-navy text-base mb-1">
                  Pengadaan Barang (Supplier)
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Penyediaan alat berat, genset diesel, APD industri K3, panel listrik, server, dan general trading dengan garansi resmi.
                </p>
              </Card>

              <Card hoverEffect className="p-5 border-l-4 border-l-corporate-gold">
                <div className="w-10 h-10 rounded-lg bg-corporate-gold-light text-corporate-gold-hover flex items-center justify-center mb-3">
                  <Wrench className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-corporate-navy text-base mb-1">
                  Layanan Jasa & Maintenance
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Instalasi kabel fiber optic, penataan rack data center, overhaul genset berkala, dan manajemen pemeliharaan fasilitas gedung.
                </p>
              </Card>

              <Card hoverEffect className="p-5 border-l-4 border-l-corporate-gold">
                <div className="w-10 h-10 rounded-lg bg-corporate-gold-light text-corporate-gold-hover flex items-center justify-center mb-3">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-corporate-navy text-base mb-1">
                  Konsultasi Teknis & BoQ
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Bantuan perumusan Kerangka Acuan Kerja (KAK), penyusunan Bill of Quantity (BoQ), dan estimasi anggaran HPS yang presisi.
                </p>
              </Card>

              <Card hoverEffect className="p-5 border-l-4 border-l-corporate-blue">
                <div className="w-10 h-10 rounded-lg bg-corporate-blue-light text-corporate-blue flex items-center justify-center mb-3">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-corporate-navy text-base mb-1">
                  Kepatuhan Dokumen Tender
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Kelengkapan faktur pajak resmi, e-faktur, surat jalan terstandarisasi, dan dokumen berita acara serah terima (BAST).
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* 3. BUSINESS CATEGORIES SECTION */}
      <section className="py-16 sm:py-20 bg-corporate-light-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
            <Badge variant="gold">Kategori Bisnis & Pengadaan</Badge>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-corporate-navy tracking-tight">
              Cakupan Pengadaan & Layanan Komprehensif
            </h2>
            <p className="text-xs sm:text-sm text-gray-600">
              Kategori barang dan jasa yang kami kelola secara profesional untuk menunjang kegiatan operasional klien.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              {
                title: "Pengadaan Barang",
                icon: Truck,
                desc: "Mesin & alat industri",
                href: "/produk",
              },
              {
                title: "Supplier Resmi",
                icon: ShieldCheck,
                desc: "Original & bergaransi",
                href: "/produk",
              },
              {
                title: "General Trading",
                icon: Building2,
                desc: "Material & ATK kantor",
                href: "/produk",
              },
              {
                title: "IT & Networking",
                icon: Server,
                desc: "Server, rack & switch",
                href: "/produk",
              },
              {
                title: "Elektrikal M&E",
                icon: Zap,
                desc: "Panel LVMDP & kabel",
                href: "/produk",
              },
              {
                title: "General Services",
                icon: Wrench,
                desc: "Instalasi & servis berkala",
                href: "/layanan",
              },
            ].map((cat, idx) => {
              const IconComponent = cat.icon;
              return (
                <Link
                  key={idx}
                  href={cat.href}
                  className="group bg-white p-5 rounded-xl border border-gray-200 text-center shadow-sm hover:shadow-corporate hover:border-corporate-gold hover:-translate-y-1 transition-all flex flex-col items-center justify-center space-y-2"
                >
                  <div className="w-12 h-12 rounded-xl bg-corporate-light-gray text-corporate-navy flex items-center justify-center group-hover:bg-corporate-gold group-hover:text-corporate-navy transition-colors">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-xs sm:text-sm text-corporate-navy group-hover:text-corporate-blue">
                    {cat.title}
                  </h3>
                  <p className="text-[11px] text-gray-500">{cat.desc}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. FEATURED PRODUCTS SECTION */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10">
            <div>
              <Badge variant="blue">Katalog Unggulan</Badge>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-corporate-navy tracking-tight mt-1">
                Produk Pengadaan Terpopuler
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                Peralatan dan material siap pasok dengan spesifikasi teruji untuk kebutuhan korporasi Anda.
              </p>
            </div>
            <Link href="/produk">
              <Button variant="outline" size="sm">
                Lihat Seluruh Katalog
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((prod) => {
              const images = safeJsonParse<string[]>(prod.images, []);
              const firstImage = images[0] || "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80";

              return (
                <Card key={prod.id} hoverEffect className="flex flex-col justify-between">
                  <div>
                    <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
                      <Image
                        src={firstImage}
                        alt={prod.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
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

                    <div className="p-5 space-y-2">
                      <p className="text-[11px] font-mono text-gray-400">SKU: {prod.sku}</p>
                      <h3 className="font-bold text-base text-corporate-navy line-clamp-1 hover:text-corporate-blue transition-colors">
                        <Link href={`/produk/${prod.slug}`}>{prod.title}</Link>
                      </h3>
                      <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                        {prod.shortDesc}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 pt-0 border-t border-gray-50 flex items-center justify-between gap-2 mt-4">
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-semibold">Estimasi Harga</p>
                      <p className="text-xs font-bold text-corporate-navy">
                        {prod.showPrice ? formatRupiah(prod.price) : "Hubungi Kami"}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/produk/${prod.slug}`}>
                        <Button variant="outline" size="sm" className="text-xs">
                          Detail
                        </Button>
                      </Link>
                      <Link href={`/rfq?item=${encodeURIComponent(prod.title)}`}>
                        <Button variant="gold" size="sm" className="text-xs font-semibold">
                          Minta Penawaran
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. SERVICES OVERVIEW SECTION */}
      <section className="py-16 sm:py-20 bg-corporate-light-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
            <Badge variant="gold">Layanan Jasa & Kontraktor</Badge>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-corporate-navy tracking-tight">
              Solusi Teknisi & Layanan Pengerjaan Berpengalaman
            </h2>
            <p className="text-xs sm:text-sm text-gray-600">
              Didukung tenaga kerja ahli, bersertifikat K3, dan peralatan inspeksi mutakhir.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((srv) => {
              const scopeItems = safeJsonParse<string[]>(srv.scopeOfWork, []);
              const images = safeJsonParse<string[]>(srv.images, []);
              const thumbnail = images[0] || "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80";

              return (
                <Card key={srv.id} hoverEffect className="flex flex-col justify-between">
                  <div>
                    <div className="relative h-44 w-full bg-gray-100 overflow-hidden">
                      <Image
                        src={thumbnail}
                        alt={srv.title}
                        fill
                        className="object-cover"
                      />
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
                      <p className="text-xs text-gray-600 line-clamp-2">
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

                  <div className="p-5 pt-0 flex justify-between items-center border-t border-gray-50 mt-4">
                    <Link href={`/layanan/${srv.slug}`}>
                      <Button variant="outline" size="sm" className="text-xs">
                        Lihat Alur Kerja
                      </Button>
                    </Link>
                    <Link href={`/rfq?item=${encodeURIComponent(srv.title)}&type=JASA`}>
                      <Button variant="gold" size="sm" className="text-xs">
                        Konsultasi Jasa
                      </Button>
                    </Link>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. WHY CHOOSE US (6 PILLARS) */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
            <Badge variant="blue">Keunggulan Kemitraan</Badge>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-corporate-navy tracking-tight">
              Mengapa Memilih PT Mitra Karya Pratama?
            </h2>
            <p className="text-xs sm:text-sm text-gray-600">
              6 pilar standar pelayanan prima kami untuk mendukung kelancaran operasional dan kepatuhan pengadaan perusahaan Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {corePillars.map((pillar, idx) => {
              const IconComp = pillar.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-corporate-light-gray/60 border border-gray-100 hover:border-corporate-gold/50 transition-all space-y-3 hover:shadow-corporate"
                >
                  <div className="w-12 h-12 rounded-xl bg-corporate-navy text-corporate-gold flex items-center justify-center shadow-md">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-base text-corporate-navy">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. DYNAMIC STATISTICS SECTION */}
      <section className="py-16 bg-corporate-navy text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center divide-y lg:divide-y-0 lg:divide-x divide-white/10">
            <div className="p-4">
              <p className="text-3xl sm:text-5xl font-black text-corporate-gold mb-2 tracking-tight">
                {statProjects}+
              </p>
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-gray-200">
                Proyek Berhasil Diselesaikan
              </p>
              <p className="text-[11px] text-gray-400 mt-1">Sektor B2B & B2G Pemerintah</p>
            </div>

            <div className="p-4">
              <p className="text-3xl sm:text-5xl font-black text-corporate-gold mb-2 tracking-tight">
                {statClients}+
              </p>
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-gray-200">
                Pelanggan & Klien Korporasi
              </p>
              <p className="text-[11px] text-gray-400 mt-1">Pabrik, Mall & Gedung Perkantoran</p>
            </div>

            <div className="p-4">
              <p className="text-3xl sm:text-5xl font-black text-corporate-gold mb-2 tracking-tight">
                {statProducts}+
              </p>
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-gray-200">
                Katalog Produk & Peralatan
              </p>
              <p className="text-[11px] text-gray-400 mt-1">Original bergaransi resmi</p>
            </div>

            <div className="p-4">
              <p className="text-3xl sm:text-5xl font-black text-corporate-gold mb-2 tracking-tight">
                {statYears} Tahun
              </p>
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-gray-200">
                Dedikasi & Rekam Jejak
              </p>
              <p className="text-[11px] text-gray-400 mt-1">Kredibilitas teruji sejak 2018</p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. RECENT PORTFOLIO SHOWCASE */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10">
            <div>
              <Badge variant="gold">Portofolio Pengadaan</Badge>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-corporate-navy tracking-tight mt-1">
                Rekam Jejak Pekerjaan & Proyek
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                Bukti nyata komitmen kami dalam menyelesaikan pekerjaan tepat waktu dan sesuai spesifikasi teknis.
              </p>
            </div>
            <Link href="/portofolio">
              <Button variant="outline" size="sm">
                Lihat Semua Portofolio
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {portfolios.map((item) => {
              const images = safeJsonParse<string[]>(item.images, []);
              const thumb = images[0] || "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80";

              return (
                <Card key={item.id} hoverEffect className="flex flex-col justify-between">
                  <div>
                    <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
                      <Image
                        src={thumb}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-3 left-3">
                        <Badge variant="blue" size="sm">
                          {item.category.name}
                        </Badge>
                      </div>
                      <div className="absolute bottom-3 right-3 bg-corporate-navy/80 px-2 py-1 rounded text-[11px] text-white font-mono">
                        {item.completionYear}
                      </div>
                    </div>

                    <div className="p-5 space-y-2">
                      <p className="text-xs text-corporate-gold font-semibold">
                        Klien: {item.clientName} | {item.location}
                      </p>
                      <h3 className="font-bold text-base text-corporate-navy line-clamp-2">
                        <Link href={`/portofolio/${item.slug}`}>{item.title}</Link>
                      </h3>
                      <p className="text-xs text-gray-600 line-clamp-2">
                        {item.shortDesc}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 pt-0 border-t border-gray-50 flex justify-between items-center mt-3">
                    <span className="text-xs text-gray-400">Status: Selesai 100%</span>
                    <Link href={`/portofolio/${item.slug}`}>
                      <Button variant="ghost" size="sm" className="text-xs">
                        Dokumentasi Proyek
                        <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* 9. CLIENT & PARTNER LOGOS */}
      <section className="py-12 bg-corporate-light-gray border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-6">
            Dipercaya Oleh Perusahaan Terkemuka & Instansi Terakreditasi
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
            {partners.map((partner) => (
              <div
                key={partner.id}
                className="px-4 py-2 bg-white rounded-lg border border-gray-200 shadow-sm text-xs font-semibold text-corporate-navy"
              >
                {partner.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. TESTIMONIALS */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
            <Badge variant="blue">Ulasan Kemitraan</Badge>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-corporate-navy tracking-tight">
              Testimoni Manajer Pengadaan & Klien Kami
            </h2>
            <p className="text-xs sm:text-sm text-gray-600">
              Pengalaman langsung kerja sama pengadaan barang dan eksekusi jasa pemeliharaan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <Card key={t.id} className="p-6 flex flex-col justify-between border-t-4 border-t-corporate-gold">
                <div className="space-y-4">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(t.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-8 h-8 text-corporate-blue/20" />
                  <p className="text-xs text-gray-700 italic leading-relaxed">
                    &ldquo;{t.feedback}&rdquo;
                  </p>
                </div>
                <div className="pt-4 border-t border-gray-100 mt-6">
                  <p className="text-sm font-bold text-corporate-navy">{t.clientName}</p>
                  <p className="text-xs text-gray-500 font-medium">
                    {t.clientPosition} &bull; {t.clientCompany}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 11. LATEST ARTICLES SECTION */}
      <section className="py-16 sm:py-20 bg-corporate-light-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10">
            <div>
              <Badge variant="gold">Artikel & Wawasan</Badge>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-corporate-navy tracking-tight mt-1">
                Wawasan Pengadaan & Standar Industri
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                Panduan praktis, kepatuhan regulasi, dan tips efisiensi manajemen rantai pasok korporasi.
              </p>
            </div>
            <Link href="/artikel">
              <Button variant="outline" size="sm">
                Semua Artikel
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((art) => (
              <Card key={art.id} hoverEffect className="flex flex-col justify-between">
                <div>
                  <div className="relative h-44 w-full bg-gray-100 overflow-hidden">
                    <Image
                      src={art.thumbnail}
                      alt={art.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge variant="blue" size="sm">
                        {art.category.name}
                      </Badge>
                    </div>
                  </div>

                  <div className="p-5 space-y-2">
                    <p className="text-[11px] text-gray-400">
                      Oleh {art.author} &bull; {new Date(art.publishedAt).toLocaleDateString("id-ID")}
                    </p>
                    <h3 className="font-bold text-base text-corporate-navy line-clamp-2 hover:text-corporate-blue transition-colors">
                      <Link href={`/artikel/${art.slug}`}>{art.title}</Link>
                    </h3>
                    <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                      {art.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-gray-50 mt-3">
                  <Link href={`/artikel/${art.slug}`} className="text-xs font-semibold text-corporate-blue hover:text-corporate-navy inline-flex items-center gap-1">
                    Baca Selengkapnya
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 12. CTA BANNER SECTION */}
      <section className="py-16 bg-gradient-to-r from-corporate-navy-dark to-corporate-blue text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <Badge variant="gold">Mulai Kerja Sama Pengadaan</Badge>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white max-w-2xl mx-auto leading-tight">
            Siap Meningkatkan Efisiensi Pengadaan Barang & Jasa Perusahaan Anda?
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 max-w-xl mx-auto">
            Dapatkan penawaran harga resmi (SPH), konsultasi spesifikasi teknis, atau proposal kerja sama dalam waktu 1x24 jam kerja.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link href="/rfq">
              <Button variant="gold" size="lg" className="w-full sm:w-auto font-bold uppercase tracking-wider text-xs sm:text-sm shadow-gold">
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Ajukan RFQ Online Sekarang
              </Button>
            </Link>
            <Link href="/kontak">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-white border-white/20 hover:bg-white/10">
                Hubungi Marketing Officer
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
