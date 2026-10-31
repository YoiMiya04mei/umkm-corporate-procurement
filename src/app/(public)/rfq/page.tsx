import React from "react";
import { prisma } from "@/lib/prisma";
import { FileSpreadsheet, ShieldCheck, Clock, CheckCircle2, PhoneCall } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { RfqMainForm } from "@/components/public/RfqMainForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Request for Quotation (RFQ) - Permintaan Penawaran Harga",
  description:
    "Formulir resmi pengajuan permintaan penawaran harga (RFQ) barang dan layanan jasa untuk instansi pemerintah dan perusahaan swasta.",
};

interface RfqPageProps {
  searchParams: Promise<{
    item?: string;
    type?: "BARANG" | "JASA" | "KEDUANYA";
  }>;
}

export default async function RfqPage({ searchParams }: RfqPageProps) {
  const params = await searchParams;
  const initialItem = params.item || "";
  const initialType = params.type || "BARANG";

  return (
    <div className="bg-corporate-light-gray min-h-screen py-10 sm:py-14">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <Badge variant="gold">Procurement Portal</Badge>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-corporate-navy tracking-tight">
            Request for Quotation (RFQ)
          </h1>
          <p className="text-xs sm:text-sm text-gray-600">
            Kirimkan rincian kebutuhan pengadaan barang atau spesifikasi jasa Anda. Tim estimasi kami akan menerbitkan Surat Penawaran Harga (SPH) resmi dalam 1x24 jam kerja.
          </p>
        </div>

        {/* Procurement SLA Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-1">
            <Clock className="w-5 h-5 text-corporate-gold mx-auto mb-1" />
            <p className="text-xs font-bold text-corporate-navy">Respon Cepat ≤ 24 Jam</p>
            <p className="text-[11px] text-gray-500">Kalkulasi HPS & ketersediaan stok</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-1">
            <ShieldCheck className="w-5 h-5 text-corporate-blue mx-auto mb-1" />
            <p className="text-xs font-bold text-corporate-navy">Dokumen Legal & Pajak</p>
            <p className="text-[11px] text-gray-500">Faktur pajak, garansi & surat jalan</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-1">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
            <p className="text-xs font-bold text-corporate-navy">Nomor Tracking RFQ</p>
            <p className="text-[11px] text-gray-500">Status transparan dan terpantau</p>
          </div>
        </div>

        {/* Main Form Card */}
        <Card className="p-6 sm:p-10">
          <RfqMainForm initialItem={initialItem} initialType={initialType} />
        </Card>
      </div>
    </div>
  );
}

