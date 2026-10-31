import React from "react";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { WhatsAppFloatingButton } from "@/components/public/WhatsAppFloatingButton";

export const dynamic = "force-dynamic";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let settings = null;
  try {
    settings = await prisma.companySetting.findUnique({
      where: { id: "default" },
    });
  } catch (error) {
    console.error("Failed to load company settings for layout:", error);
  }

  const companyName = settings?.name || "PT MITRA KARYA PRATAMA";
  const legalName = settings?.legalName || "PT Mitra Karya Pratama Mandiri";
  const tagline = settings?.tagline || "Solusi Terpercaya Pengadaan Barang dan Layanan Jasa Terpadu";
  const address = settings?.address || "Jl. Raya Industri Utama No. 88, Kawasan Niaga Terpadu, Jakarta Selatan";
  const phone = settings?.phone || "(021) 7890-1234";
  const email = settings?.email || "procurement@perusahaan.co.id";
  const whatsapp = settings?.whatsapp || "6281234567890";
  const operationalHours = settings?.operationalHours || "Senin - Jumat: 08:30 - 17:30 WIB";
  const nib = settings?.nib || "0220101234567";
  const npwp = settings?.npwp || "01.234.567.8-012.000";

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar companyName={companyName} tagline={tagline} whatsapp={whatsapp} />
      <main className="flex-grow">{children}</main>
      <Footer
        companyName={companyName}
        legalName={legalName}
        tagline={tagline}
        address={address}
        phone={phone}
        email={email}
        whatsapp={whatsapp}
        operationalHours={operationalHours}
        nib={nib}
        npwp={npwp}
      />
      <WhatsAppFloatingButton whatsapp={whatsapp} companyName={companyName} />
    </div>
  );
}
