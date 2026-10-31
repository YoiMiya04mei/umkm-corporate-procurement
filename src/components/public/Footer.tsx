import React from "react";
import Link from "next/link";
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  Clock,
  ExternalLink,
  ShieldCheck,
  FileText,
  Linkedin,
  Instagram,
  Facebook,
  Youtube,
} from "lucide-react";

interface FooterProps {
  companyName?: string;
  legalName?: string;
  tagline?: string;
  address?: string;
  phone?: string;
  email?: string;
  whatsapp?: string;
  operationalHours?: string;
  nib?: string;
  npwp?: string;
}

export function Footer({
  companyName = "PT MITRA KARYA PRATAMA",
  legalName = "PT Mitra Karya Pratama Mandiri",
  tagline = "Solusi Terpercaya Pengadaan Barang dan Layanan Jasa Terpadu",
  address = "Jl. Raya Industri Utama No. 88, Kawasan Niaga Terpadu, Jakarta Selatan",
  phone = "(021) 7890-1234",
  email = "procurement@perusahaan.co.id",
  whatsapp = "6281234567890",
  operationalHours = "Senin - Jumat: 08:30 - 17:30 WIB",
  nib = "0220101234567",
  npwp = "01.234.567.8-012.000",
}: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-corporate-navy-dark text-gray-300 border-t border-corporate-blue/40">
      {/* Top Banner / Trust Bar */}
      <div className="border-b border-white/10 bg-corporate-navy py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-sm">
            <ShieldCheck className="w-6 h-6 text-corporate-gold shrink-0" />
            <div>
              <p className="font-semibold text-white">Legalitas Perusahaan Terverifikasi</p>
              <p className="text-xs text-gray-400">
                NIB: {nib} | NPWP: {npwp}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/rfq"
              className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-lg bg-corporate-gold/20 text-corporate-gold border border-corporate-gold/40 hover:bg-corporate-gold hover:text-corporate-navy transition-all"
            >
              <FileText className="w-3.5 h-3.5" />
              Ajukan Permintaan Penawaran (RFQ)
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1: Company Profile */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-corporate-blue border border-corporate-gold/40 flex items-center justify-center text-corporate-gold shadow-gold">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-base">{companyName}</h4>
                <p className="text-[11px] text-gray-400">{legalName}</p>
              </div>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              {tagline}. Penyedia barang (supplier) dan layanan jasa (contractor & service provider) B2B/B2G berstandar mutu tinggi.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-corporate-gold hover:text-corporate-navy transition-all"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-corporate-gold hover:text-corporate-navy transition-all"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-corporate-gold hover:text-corporate-navy transition-all"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-corporate-gold hover:text-corporate-navy transition-all"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/10 pb-2">
              Navigasi Cepat
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-corporate-gold transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/tentang-kami" className="hover:text-corporate-gold transition-colors">
                  Tentang Kami & Legalitas
                </Link>
              </li>
              <li>
                <Link href="/produk" className="hover:text-corporate-gold transition-colors">
                  Katalog Pengadaan Barang
                </Link>
              </li>
              <li>
                <Link href="/layanan" className="hover:text-corporate-gold transition-colors">
                  Daftar Layanan Jasa
                </Link>
              </li>
              <li>
                <Link href="/portofolio" className="hover:text-corporate-gold transition-colors">
                  Portofolio & Rekam Jejak
                </Link>
              </li>
              <li>
                <Link href="/artikel" className="hover:text-corporate-gold transition-colors">
                  Artikel & Wawasan Industri
                </Link>
              </li>
              <li>
                <Link href="/kontak" className="hover:text-corporate-gold transition-colors">
                  Hubungi Kami
                </Link>
              </li>
              <li>
                <Link href="/rfq" className="text-corporate-gold font-semibold hover:underline">
                  Formulir RFQ Penawaran Harga
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Business Scope */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/10 pb-2">
              Kategori Pengadaan
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>• Pengadaan Barang & Alat Berat</li>
              <li>• Perangkat IT, Server & Jaringan</li>
              <li>• Elektrikal & Panel Distribusi LVMDP</li>
              <li>• Safety Equipment & APD Pekerja K3</li>
              <li>• Perlengkapan & Furniture Kantor</li>
              <li>• Jasa Instalasi Fiber Optic Data Center</li>
              <li>• Jasa Servis & Maintenance Genset</li>
              <li>• Jasa Konsultasi Manajemen Pengadaan</li>
            </ul>
          </div>

          {/* Column 4: Contact & Office */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/10 pb-2">
              Kantor & Kontak
            </h4>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-corporate-gold shrink-0 mt-0.5" />
                <span className="text-gray-300">{address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-corporate-gold shrink-0" />
                <span className="text-gray-300">{phone}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-corporate-gold shrink-0" />
                <span className="text-gray-300">{email}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-corporate-gold shrink-0" />
                <span className="text-gray-400">{operationalHours}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar / Copyright */}
      <div className="border-t border-white/10 py-5 bg-corporate-navy-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-gray-400">
          <p>
            &copy; {currentYear} {companyName}. Seluruh Hak Cipta Dilindungi Undang-Undang.
          </p>
          <div className="flex items-center space-x-6 text-[11px]">
            <span>Dokumentasi Resmi UMKM</span>
            <span>Kepatuhan Regulasi K3 & Pajak</span>
            <Link href="/admin/login" className="hover:text-corporate-gold transition-colors">
              Staff CMS Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

