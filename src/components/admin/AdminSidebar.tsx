"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  Wrench,
  Briefcase,
  FileText,
  Tags,
  FileSpreadsheet,
  Settings,
  LogOut,
  ExternalLink,
  Building2,
  Menu,
  X,
} from "lucide-react";

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { label: "Overview", href: "/admin", icon: LayoutDashboard },
    { label: "Manajemen RFQ", href: "/admin/rfq", icon: FileSpreadsheet },
    { label: "Katalog Produk", href: "/admin/products", icon: Package },
    { label: "Layanan Jasa", href: "/admin/services", icon: Wrench },
    { label: "Portofolio Proyek", href: "/admin/portfolio", icon: Briefcase },
    { label: "Artikel & Berita", href: "/admin/articles", icon: FileText },
    { label: "Kelola Kategori", href: "/admin/categories", icon: Tags },
    { label: "Pengaturan Perusahaan", href: "/admin/settings", icon: Settings },
  ];

  const handleLogout = async () => {
    try {
      await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "logout" }),
      });
      router.push("/admin/login");
      router.refresh();
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <>
      {/* Mobile Topbar with Hamburger */}
      <div className="lg:hidden bg-corporate-navy text-white px-4 py-3 flex items-center justify-between border-b border-corporate-blue/40 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-corporate-gold" />
          <span className="font-bold text-sm tracking-tight">Admin CMS Portal</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-1.5 rounded-lg text-gray-300 hover:text-white"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Container */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 w-64 bg-corporate-navy text-gray-300 flex flex-col justify-between border-r border-corporate-blue/40 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen lg:shrink-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Brand Header */}
        <div>
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-corporate-blue border border-corporate-gold/40 flex items-center justify-center text-corporate-gold shadow-gold">
                <Building2 className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm text-white leading-tight">
                  CMS Corporate
                </span>
                <span className="text-[10px] text-gray-400 uppercase tracking-wider">
                  Admin Dashboard
                </span>
              </div>
            </Link>
          </div>

          {/* Nav Items */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200",
                    isActive
                      ? "bg-corporate-blue text-corporate-gold font-bold shadow-sm"
                      : "text-gray-300 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <Icon className={cn("w-4 h-4 shrink-0", isActive ? "text-corporate-gold" : "text-gray-400")} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2 rounded-lg text-xs text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              Buka Website Publik
            </span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Keluar (Logout)</span>
          </button>
        </div>
      </aside>

      {/* Backdrop for mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-20 bg-corporate-navy/80 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  );
}

