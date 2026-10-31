import React from "react";
import { prisma } from "@/lib/prisma";
import { MapPin, Phone, Mail, Clock, MessageSquare, Building2, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { ContactForm } from "@/components/public/ContactForm";
import { getWhatsAppUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Hubungi Kami & Lokasi Kantor",
  description:
    "Hubungi tim pemasaran dan administrasi PT Mitra Karya Pratama. Alamat kantor, nomor WhatsApp, email resmi, dan jam operasional.",
};

export default async function ContactPage() {
  const settings = await prisma.companySetting.findUnique({
    where: { id: "default" },
  });

  const companyName = settings?.name || "PT MITRA KARYA PRATAMA";
  const address = settings?.address || "Jl. Raya Industri Utama No. 88, Kawasan Niaga Terpadu, Jakarta Selatan";
  const city = settings?.city || "Jakarta Selatan";
  const province = settings?.province || "DKI Jakarta";
  const postalCode = settings?.postalCode || "12340";
  const phone = settings?.phone || "(021) 7890-1234";
  const whatsapp = settings?.whatsapp || "6281234567890";
  const email = settings?.email || "procurement@perusahaan.co.id";
  const operationalHours = settings?.operationalHours || "Senin - Jumat: 08:30 - 17:30 WIB | Sabtu: 09:00 - 14:00 WIB";
  const mapsEmbed =
    settings?.googleMapsEmbed ||
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126920.2858169222!2d106.75628586392348!3d-6.229569450371485!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f3e49fe3dd05%3A0x6b245cb5797d10e!2sJakarta%20Selatan!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid";

  return (
    <div className="bg-corporate-light-gray min-h-screen py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="space-y-3">
          <Badge variant="gold">Hubungi Perusahaan</Badge>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-corporate-navy tracking-tight">
            Kontak Kami & Lokasi Kantor Operasional
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 max-w-2xl">
            Punya pertanyaan mengenai katalog produk, tender pengadaan, permohonan survey, atau kerja sama vendor? Tim marketing dan procurement kami siap membantu Anda.
          </p>
        </div>

        {/* 2 Columns: Contact Information + Interactive Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Office Details */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="p-6 sm:p-8 space-y-6">
              <div className="space-y-1 border-b border-gray-100 pb-4">
                <h3 className="font-bold text-base text-corporate-navy flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-corporate-blue" />
                  Kantor Pusat & Operasional
                </h3>
                <p className="text-xs text-gray-500">{companyName}</p>
              </div>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-corporate-light-gray text-corporate-blue flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-corporate-navy">Alamat Lengkap</p>
                    <p className="text-gray-600 leading-relaxed mt-0.5">
                      {address}, {city}, {province} {postalCode}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-corporate-light-gray text-corporate-blue flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-corporate-navy">Telepon Kantor</p>
                    <p className="text-gray-600 mt-0.5">{phone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-corporate-navy">Layanan WhatsApp Pengadaan</p>
                    <a
                      href={getWhatsAppUrl(whatsapp, `Halo ${companyName}, saya ingin berkonsultasi mengenai pengadaan.`)}
                      target="_blank"
                      rel="noreferrer"
                      className="text-emerald-700 font-semibold hover:underline inline-block mt-0.5"
                    >
                      +{whatsapp} (Respon Cepat)
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-corporate-light-gray text-corporate-blue flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-corporate-navy">Email Resmi Penawaran</p>
                    <p className="text-gray-600 mt-0.5">{email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-corporate-light-gray text-corporate-blue flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-corporate-navy">Jam Operasional Pelayanan</p>
                    <p className="text-gray-600 mt-0.5">{operationalHours}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Google Maps Embed */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm h-64 relative">
              <iframe
                title="Google Maps Location"
                src={mapsEmbed}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Right Column: Interactive Contact Form */}
          <div className="lg:col-span-7">
            <Card className="p-6 sm:p-10 space-y-6">
              <div className="space-y-1 border-b border-gray-100 pb-4">
                <Badge variant="blue">Formulir Pertanyaan & Permohonan</Badge>
                <h3 className="text-xl font-bold text-corporate-navy">
                  Kirimkan Pesan Langsung ke Departemen Marketing
                </h3>
                <p className="text-xs text-gray-500">
                  Isi formulir di bawah ini. Tim kami akan merespons melalui email atau WhatsApp dalam 1x24 jam kerja.
                </p>
              </div>

              <ContactForm />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

