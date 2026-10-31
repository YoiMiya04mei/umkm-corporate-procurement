import React from "react";
import Link from "next/link";
import { CheckCircle2, MessageSquare, ArrowLeft, FileSpreadsheet, Home, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { prisma } from "@/lib/prisma";
import { getWhatsAppUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Permintaan Penawaran Berhasil Diajukan | RFQ Sukses",
};

interface RfqSuccessPageProps {
  searchParams: Promise<{
    number?: string;
    item?: string;
    name?: string;
  }>;
}

export default async function RfqSuccessPage({ searchParams }: RfqSuccessPageProps) {
  const params = await searchParams;
  const rfqNumber = params.number || "RFQ-CONFIRMED";
  const item = params.item || "Pengadaan Barang/Jasa";
  const name = params.name || "Bapak/Ibu";

  const settings = await prisma.companySetting.findUnique({
    where: { id: "default" },
  });

  const companyName = settings?.name || "PT MITRA KARYA PRATAMA";
  const whatsappNumber = settings?.whatsapp || "6281234567890";

  const waFollowupText = `Halo Tim Pengadaan ${companyName}, saya ${name} telah mengajukan permintaan penawaran harga via website dengan Nomor RFQ: *${rfqNumber}* untuk item *${item}*. Mohon bantuannya untuk tindak lanjut dan estimasi penawaran harga resminya. Terima kasih.`;

  return (
    <div className="bg-corporate-light-gray min-h-screen py-16 sm:py-24 flex items-center justify-center">
      <div className="max-w-xl mx-auto px-4 w-full">
        <Card className="p-8 sm:p-10 text-center space-y-6 border-t-8 border-t-emerald-600 shadow-corporate-lg">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-corporate-navy">
              Permintaan RFQ Berhasil Dikirim!
            </h1>
            <p className="text-xs sm:text-sm text-gray-600">
              Terima kasih, <strong>{name}</strong>. Permintaan penawaran harga Anda telah masuk ke dalam antrean sistem procurement kami.
            </p>
          </div>

          {/* Tracking Number Card */}
          <div className="bg-corporate-light-gray p-5 rounded-xl border border-gray-200 text-left space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-gray-200">
              <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
                Nomor Tiket RFQ:
              </span>
              <span className="font-mono font-bold text-base sm:text-lg text-corporate-blue">
                {rfqNumber}
              </span>
            </div>
            <div className="text-xs text-gray-700 space-y-1">
              <p>
                <strong>Kebutuhan:</strong> {item}
              </p>
              <p>
                <strong>Status Awal:</strong> <span className="text-emerald-700 font-semibold">NEW (Menunggu Review Estimator)</span>
              </p>
            </div>
          </div>

          <div className="space-y-2 text-xs text-gray-500 max-w-md mx-auto">
            <p>
              Tim sales engineer kami akan memverifikasi spesifikasi teknis dan menerbitkan Surat Penawaran Harga (SPH) resmi dalam waktu <strong>maksimal 1x24 jam kerja</strong>.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <a
              href={getWhatsAppUrl(whatsappNumber, waFollowupText)}
              target="_blank"
              rel="noreferrer"
              className="block"
            >
              <Button variant="gold" size="md" className="w-full font-bold uppercase tracking-wider text-xs shadow-gold">
                <MessageSquare className="w-4 h-4 mr-2" />
                Konfirmasi Cepat via WhatsApp
              </Button>
            </a>

            <div className="flex gap-2 justify-center pt-2">
              <Link href="/">
                <Button variant="outline" size="sm" className="text-xs">
                  <Home className="w-3.5 h-3.5 mr-1.5" />
                  Ke Beranda
                </Button>
              </Link>
              <Link href="/produk">
                <Button variant="outline" size="sm" className="text-xs">
                  Lihat Katalog Lainnya
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
