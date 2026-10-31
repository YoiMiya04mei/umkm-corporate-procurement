import React from "react";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  ShieldCheck,
  Target,
  Compass,
  CheckCircle2,
  Users,
  Award,
  FileText,
  Building2,
  ArrowRight,
  Briefcase,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { safeJsonParse } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Tentang Kami & Legalitas Perusahaan",
  description:
    "Profil lengkap, visi & misi, rekam jejak, komitmen mutu, struktur organisasi, dan legalitas resmi PT Mitra Karya Pratama.",
};

export default async function AboutUsPage() {
  const settings = await prisma.companySetting.findUnique({
    where: { id: "default" },
  });

  const companyName = settings?.name || "PT MITRA KARYA PRATAMA";
  const legalName = settings?.legalName || "PT Mitra Karya Pratama Mandiri";

  const missionList = safeJsonParse<string[]>(settings?.mission, [
    "Menyediakan produk berkualitas tinggi dengan harga yang kompetitif.",
    "Memberikan pelayanan prima dan responsif dalam setiap proyek pengadaan dan jasa.",
    "Membangun kemitraan strategis jangka panjang yang berlandaskan transparansi dan integritas.",
    "Menerapkan tata kelola perusahaan yang profesional dan patuh terhadap standar regulasi.",
  ]);

  const coreValues = safeJsonParse<{ title: string; desc: string }[]>(
    settings?.coreValues,
    [
      { title: "Integritas", desc: "Menjunjung tinggi transparansi, akuntabilitas, dan etika bisnis yang sehat." },
      { title: "Kualitas Unggul", desc: "Memastikan seluruh barang dan pekerjaan jasa teruji kelayakannya." },
      { title: "Ketepatan Waktu", desc: "Berkomitmen memenuhi delivery date dan target penyelesaian proyek." },
      { title: "Orientasi Solusi", desc: "Memberikan rekomendasi teknis yang efisien dan bernilai ekonomis bagi klien." },
    ]
  );

  const serviceCommitments = safeJsonParse<string[]>(
    settings?.serviceCommitments,
    [
      "Jaminan 100% Produk Original & Bergaransi Pabrik",
      "Respon Permintaan Penawaran (RFQ) Maksimal 1x24 Jam Kerja",
      "Dukungan Teknis & Purna Jual Responsif",
      "Kelengkapan Dokumen Faktur Pajak & Surat Jalan Resmi",
    ]
  );

  const certifications = safeJsonParse<string[]>(
    settings?.certifications,
    [
      "Sertifikat Standar KBLI 4659 (Perdagangan Besar Mesin, Peralatan & Perlengkapan)",
      "Sertifikat Standar KBLI 6199 (Aktivitas Telekomunikasi Lainnya)",
      "Sistem Manajemen K3 (SMK3) Terverifikasi",
      "ISO 9001:2015 Quality Management Compliant",
    ]
  );

  const orgStructure = [
    {
      position: "Direktur Utama",
      name: "Ir. H. Pratama Wicaksana, M.T. [DEMO]",
      dept: "Executive Board",
      desc: "Bertanggung jawab atas arah strategis perusahaan, kepatuhan tata kelola, dan ekspansi kemitraan B2B.",
    },
    {
      position: "Direktur Operasional & Teknik",
      name: "Budi Santoso, S.T. [DEMO]",
      dept: "Operations & Engineering",
      desc: "Mengawasi manajemen rantai pasok, kontrol mutu barang, serta pelaksanaan pengerjaan teknis di lapangan.",
    },
    {
      position: "Head of Procurement & Estimasi",
      name: "Dewi Lestari, S.E. [DEMO]",
      dept: "Procurement & Cost Estimation",
      desc: "Memimpin negosiasi prinsipal, kalkulasi HPS, dan penyusunan Surat Penawaran Harga (SPH) resmi.",
    },
    {
      position: "Head of Marketing & Client Relations",
      name: "Ahmad Faisal, S.I.Kom. [DEMO]",
      dept: "Sales & Client Success",
      desc: "Memastikan kebutuhan klien korporasi terpenuhi dengan respons cepat dan SLA pelayanan terjaga.",
    },
  ];

  return (
    <div className="bg-white">
      {/* 1. Header Banner */}
      <section className="bg-gradient-to-r from-corporate-navy-dark via-corporate-navy to-corporate-blue text-white py-16 sm:py-20 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <Badge variant="gold">Profil Perusahaan</Badge>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Tentang {companyName}
          </h1>
          <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto">
            {legalName} &bull; Mitra strategis pengadaan barang dan layanan jasa teknik yang mengutamakan mutu, integritas, dan ketepatan waktu.
          </p>
        </div>
      </section>

      {/* 2. Company History & Story */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-5">
              <Badge variant="blue">Sejarah & Rekam Jejak</Badge>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-corporate-navy tracking-tight">
                Membangun Kredibilitas Melalui Kepercayaan Mitra Kerja
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                {settings?.history ||
                  "Didirikan dengan semangat memberikan efisiensi rantai pasok bagi sektor industri dan instansi di Indonesia, PT Mitra Karya Pratama berawal dari penyedia peralatan teknik dan umum. Seiring perkembangan pesat dan kepercayaan mitra strategis, kini perusahaan telah bertransformasi menjadi vendor terpadu pengadaan multi-kategori dan kontraktor jasa pemeliharaan bersertifikasi."}
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                {settings?.description ||
                  "Kami terus berinovasi dalam mengintegrasikan teknologi informasi pada rantai pasok untuk memastikan klien mendapatkan kepastian ketersediaan stok, transparansi harga yang kompetitif, dan jaminan purna jual terpercaya."}
              </p>
            </div>

            <div className="lg:col-span-6">
              <div className="relative h-80 sm:h-96 w-full rounded-2xl overflow-hidden shadow-corporate-lg border border-gray-100">
                <Image
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=80"
                  alt="Kantor Pusat Perusahaan"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Vision, Mission & Values */}
      <section className="py-16 sm:py-20 bg-corporate-light-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Vision */}
            <Card className="p-8 border-t-4 border-t-corporate-navy space-y-4">
              <div className="w-12 h-12 rounded-xl bg-corporate-navy text-corporate-gold flex items-center justify-center">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-corporate-navy">Visi Perusahaan</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                &ldquo;{settings?.vision || "Menjadi mitra pengadaan barang dan penyedia jasa terkemuka di Indonesia yang terpercaya, profesional, dan memberikan nilai tambah berkelanjutan bagi seluruh pemangku kepentingan."}&rdquo;
              </p>
            </Card>

            {/* Mission */}
            <Card className="p-8 border-t-4 border-t-corporate-gold space-y-4">
              <div className="w-12 h-12 rounded-xl bg-corporate-gold-light text-corporate-gold-hover flex items-center justify-center">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-corporate-navy">Misi Perusahaan</h3>
              <ul className="space-y-2 text-xs sm:text-sm text-gray-700">
                {missionList.map((m, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-corporate-gold shrink-0 mt-0.5" />
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          {/* Core Values */}
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-bold text-corporate-navy">Nilai-Nilai Utama Perusahaan (Core Values)</h3>
              <p className="text-xs text-gray-500 mt-1">Prinsip kerja yang membimbing setiap langkah operasional kami.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {coreValues.map((val, idx) => (
                <div key={idx} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-corporate-blue-light text-corporate-blue font-bold flex items-center justify-center text-xs">
                    0{idx + 1}
                  </div>
                  <h4 className="font-bold text-base text-corporate-navy">{val.title}</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">{val.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Service Commitments */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-corporate-navy text-white rounded-3xl p-8 sm:p-12 overflow-hidden relative shadow-2xl">
            <div className="relative z-10 max-w-3xl space-y-6">
              <Badge variant="gold">Komitmen Pelayanan</Badge>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Dedikasi Kami untuk Kualitas Tanpa Kompromi
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {serviceCommitments.map((comm, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-white/10 p-3.5 rounded-xl border border-white/10">
                    <CheckCircle2 className="w-5 h-5 text-corporate-gold shrink-0" />
                    <span className="text-xs sm:text-sm font-medium text-gray-200">{comm}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Company Legalities & Documentation */}
      <section className="py-16 sm:py-20 bg-corporate-light-gray" id="legalitas">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <Badge variant="gold">Kepatuhan Hukum & Dokumen Resmi</Badge>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-corporate-navy tracking-tight">
              Legalitas & Izin Usaha Terdaftar
            </h2>
            <p className="text-xs sm:text-sm text-gray-600">
              Kelengkapan dokumen administrasi untuk pemenuhan verifikasi tender, kontrak kerja sama korporasi, dan audit instansi pemerintah.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card className="p-6 space-y-4">
              <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                <FileText className="w-6 h-6 text-corporate-blue" />
                <h3 className="font-bold text-base text-corporate-navy">Dokumen Perizinan Pokok</h3>
              </div>
              <div className="space-y-3 text-xs">
                <div>
                  <p className="font-semibold text-gray-500 uppercase tracking-wider text-[10px]">
                    Nomor Induk Berusaha (NIB)
                  </p>
                  <p className="font-mono font-bold text-corporate-navy text-sm mt-0.5">
                    {settings?.nib || "0220101234567 [DEMO]"}
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-gray-500 uppercase tracking-wider text-[10px]">
                    Nomor Pokok Wajib Pajak (NPWP)
                  </p>
                  <p className="font-mono font-bold text-corporate-navy text-sm mt-0.5">
                    {settings?.npwp || "01.234.567.8-012.000 [DEMO]"}
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-gray-500 uppercase tracking-wider text-[10px]">
                    Akta Notaris Pendirian
                  </p>
                  <p className="font-medium text-gray-800 text-xs mt-0.5">
                    {settings?.aktaPendirian || "Akta Notaris No. 25 Tanggal 15 Januari 2018 [DEMO]"}
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-gray-500 uppercase tracking-wider text-[10px]">
                    SK Pengesahan Kemenkumham
                  </p>
                  <p className="font-mono font-medium text-gray-800 text-xs mt-0.5">
                    {settings?.skKemenkumham || "AHU-0012345.AH.01.01.TAHUN 2018 [DEMO]"}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 space-y-4">
              <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                <Award className="w-6 h-6 text-corporate-gold" />
                <h3 className="font-bold text-base text-corporate-navy">Sertifikasi & Kualifikasi</h3>
              </div>
              <div className="space-y-3 text-xs">
                <p className="text-gray-600">
                  Perusahaan memegang izin usaha dan kualifikasi teknis yang sesuai dengan standar klasifikasi baku lapangan usaha Indonesia (KBLI):
                </p>
                <div className="space-y-2">
                  {certifications.map((cert, idx) => (
                    <div key={idx} className="flex items-start gap-2 bg-white p-2.5 rounded-lg border border-gray-100">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="font-medium text-gray-700">{cert}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* 6. Organization Structure */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <Badge variant="blue">Manajemen & Sumber Daya</Badge>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-corporate-navy tracking-tight">
              Struktur Organisasi & Tim Ahli
            </h2>
            <p className="text-xs sm:text-sm text-gray-600">
              Dipimpin oleh para profesional berpengalaman di bidang supply chain, rekayasa mekanikal, dan tata kelola korporasi.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {orgStructure.map((member, idx) => (
              <Card key={idx} hoverEffect className="p-6 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-corporate-light-gray text-corporate-navy flex items-center justify-center mx-auto border-2 border-corporate-gold/40">
                  <Users className="w-7 h-7 text-corporate-blue" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-corporate-navy">{member.name}</h4>
                  <p className="text-xs font-semibold text-corporate-gold mt-0.5">{member.position}</p>
                  <p className="text-[11px] text-gray-400 uppercase tracking-wider">{member.dept}</p>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed pt-2 border-t border-gray-100">
                  {member.desc}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Bottom Call to Action */}
      <section className="py-12 bg-corporate-navy text-white text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-4">
          <h3 className="text-xl sm:text-2xl font-bold">
            Ingin Mengajukan Kemitraan Vendor Pengadaan?
          </h3>
          <p className="text-xs sm:text-sm text-gray-300">
            Hubungi tim administrasi kami untuk permohonan Company Profile lengkap (format PDF) atau pengajuan dokumen prakualifikasi vendor.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <Link href="/kontak">
              <Button variant="gold" size="sm">
                Hubungi Kami
              </Button>
            </Link>
            <Link href="/rfq">
              <Button variant="outline" size="sm" className="text-white border-white/20 hover:bg-white/10">
                Ajukan RFQ Penawaran
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
