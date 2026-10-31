"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Menu,
  X,
  PhoneCall,
  FileSpreadsheet,
  Building2,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface NavbarProps {
  companyName?: string;
  tagline?: string;
  whatsapp?: string;
}

export function Navbar({
  companyName = "PT MITRA KARYA PRATAMA",
  whatsapp = "6281234567890",
}: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Tentang Kami", href: "/tentang-kami" },
    { label: "Produk", href: "/produk" },
    { label: "Layanan", href: "/layanan" },
    { label: "Portofolio", href: "/portofolio" },
    { label: "Artikel", href: "/artikel" },
    { label: "Kontak", href: "/kontak" },
  ];

  return (
    <>
      {/* Top Header Bar for B2B Contact Info */}
      <div className="bg-corporate-navy-dark text-gray-300 text-xs py-2 px-4 border-b border-white/10 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <span className="flex items-center gap-1.5 text-gray-300">
              <ShieldCheck className="w-3.5 h-3.5 text-corporate-gold" />
              Vendor Resmi Pengadaan Barang & Layanan Jasa B2B / B2G
            </span>
            <span className="text-white/20">|</span>
            <span className="text-gray-400">Jam Operasional: 08.30 - 17.30 WIB</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/admin/login"
              className="text-gray-400 hover:text-corporate-gold transition-colors text-[11px]"
            >
              CMS Portal Admin
            </Link>
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <header
        className={cn(
          "sticky top-0 z-40 w-full transition-all duration-300 bg-corporate-navy",
          isScrolled
            ? "shadow-corporate-lg py-2.5 bg-corporate-navy/95 backdrop-blur-md border-b border-corporate-blue/40"
            : "py-3.5 border-b border-white/10"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo & Corporate Identity */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-corporate-blue to-corporate-navy border border-corporate-gold/40 flex items-center justify-center text-corporate-gold shadow-gold group-hover:scale-105 transition-transform">
                <Building2 className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-base sm:text-lg text-white tracking-tight leading-tight group-hover:text-corporate-gold transition-colors">
                  {companyName}
                </span>
                <span className="text-[10px] text-gray-300 uppercase tracking-widest font-medium">
                  Supplier & Service Provider
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => {
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative",
                      isActive
                        ? "text-corporate-gold font-semibold"
                        : "text-gray-200 hover:text-white hover:bg-white/5"
                    )}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-3.5 right-3.5 h-0.5 bg-corporate-gold rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Desktop Action Buttons */}
            <div className="hidden sm:flex items-center space-x-3">
              <Link href="/rfq">
                <Button
                  variant="gold"
                  size="sm"
                  className="font-bold text-xs uppercase tracking-wider"
                >
                  <FileSpreadsheet className="w-4 h-4 mr-1.5" />
                  Minta Penawaran
                </Button>
              </Link>
            </div>

            {/* Mobile Hamburger Toggle */}
            <div className="flex lg:hidden items-center space-x-2">
              <Link href="/rfq" className="sm:hidden">
                <Button variant="gold" size="sm" className="text-xs px-2.5 py-1.5">
                  RFQ
                </Button>
              </Link>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-white" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Slide-down Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-corporate-navy border-b border-corporate-blue/40 px-4 pt-3 pb-6 space-y-2 animate-fadeIn">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-corporate-blue text-corporate-gold font-semibold"
                      : "text-gray-200 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <span>{link.label}</span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </Link>
              );
            })}

            <div className="pt-4 border-t border-white/10 space-y-2">
              <Link href="/rfq" className="block w-full">
                <Button variant="gold" className="w-full justify-center">
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  Minta Penawaran Harga (RFQ)
                </Button>
              </Link>
              <Link href="/admin/login" className="block text-center text-xs text-gray-400 py-1">
                Akses CMS Admin Portal
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}

