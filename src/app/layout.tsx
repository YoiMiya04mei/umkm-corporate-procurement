import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s | PT Mitra Karya Pratama - Vendor Pengadaan & Jasa B2B B2G",
    default: "PT Mitra Karya Pratama | Solusi Pengadaan Barang & Layanan Jasa Terpadu",
  },
  description:
    "Perusahaan supplier pengadaan barang dan penyedia jasa (service provider) terpercaya untuk B2B dan B2G di Indonesia. Pengadaan alat berat, IT, elektrikal, safety APD, dan jasa pemeliharaan bersertifikasi.",
  keywords: [
    "pengadaan barang",
    "supplier industri",
    "vendor b2b jakarta",
    "general trading",
    "jasa mekanikal elektrikal",
    "instalasi fiber optic",
    "genset silent perkins",
    "vendor lkpp",
    "procurement indonesia",
  ],
  authors: [{ name: "PT Mitra Karya Pratama" }],
  openGraph: {
    title: "PT Mitra Karya Pratama | Vendor Pengadaan Barang & Jasa Terpadu",
    description:
      "Mitra terpercaya pengadaan barang industrial, IT, elektrikal, safety APD, dan layanan pemeliharaan berstandar nasional.",
    url: "https://mitrakaryapratama.co.id",
    siteName: "PT Mitra Karya Pratama",
    locale: "id_ID",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="min-h-screen flex flex-col font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
