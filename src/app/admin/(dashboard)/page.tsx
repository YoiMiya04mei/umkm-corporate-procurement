import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  Package,
  Wrench,
  Briefcase,
  FileText,
  FileSpreadsheet,
  Tags,
  AlertCircle,
  Clock,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Plus,
  Settings,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const [
    totalProducts,
    totalServices,
    totalPortfolio,
    totalArticles,
    totalRfqs,
    newRfqs,
    totalCategories,
    recentRfqs,
    recentContacts,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.service.count(),
    prisma.portfolio.count(),
    prisma.article.count(),
    prisma.rfqRequest.count(),
    prisma.rfqRequest.count({ where: { status: "NEW" } }),
    prisma.category.count(),
    prisma.rfqRequest.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
    }),
    prisma.contactMessage.findMany({
      take: 4,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const metrics = [
    {
      title: "Permintaan RFQ",
      value: totalRfqs,
      subValue: `${newRfqs} Menunggu Review`,
      icon: FileSpreadsheet,
      badge: newRfqs > 0 ? "warning" : "default",
      color: "text-amber-600 bg-amber-50",
      href: "/admin/rfq",
    },
    {
      title: "Katalog Produk",
      value: totalProducts,
      subValue: "Barang & Alat",
      icon: Package,
      badge: "default",
      color: "text-corporate-blue bg-corporate-blue-light",
      href: "/admin/products",
    },
    {
      title: "Layanan Jasa",
      value: totalServices,
      subValue: "Teknis & M&E",
      icon: Wrench,
      badge: "default",
      color: "text-indigo-600 bg-indigo-50",
      href: "/admin/services",
    },
    {
      title: "Portofolio Proyek",
      value: totalPortfolio,
      subValue: "Dokumentasi",
      icon: Briefcase,
      badge: "default",
      color: "text-emerald-600 bg-emerald-50",
      href: "/admin/portfolio",
    },
    {
      title: "Artikel Berita",
      value: totalArticles,
      subValue: "Publikasi",
      icon: FileText,
      badge: "default",
      color: "text-purple-600 bg-purple-50",
      href: "/admin/articles",
    },
    {
      title: "Total Kategori",
      value: totalCategories,
      subValue: "Terklasifikasi",
      icon: Tags,
      badge: "default",
      color: "text-gray-600 bg-gray-100",
      href: "/admin/categories",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "NEW":
        return <Badge variant="warning">BARU (NEW)</Badge>;
      case "REVIEWED":
        return <Badge variant="blue">REVIEWED</Badge>;
      case "QUOTATION_PREPARED":
        return <Badge variant="gold">SPH DISIAPKAN</Badge>;
      case "SENT":
        return <Badge variant="outline">TERKIRIM</Badge>;
      case "APPROVED":
        return <Badge variant="success">DISETUJUI</Badge>;
      case "REJECTED":
        return <Badge variant="danger">DITOLAK</Badge>;
      case "COMPLETED":
        return <Badge variant="success">SELESAI</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-corporate-navy via-corporate-navy to-corporate-blue text-white rounded-2xl p-6 sm:p-8 shadow-corporate flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <Badge variant="gold" size="sm">
            Control Panel
          </Badge>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Dashboard Manajemen Pengadaan & Konten
          </h1>
          <p className="text-xs text-gray-300">
            Kelola katalog barang, penawaran harga (RFQ), portofolio proyek, serta informasi legalitas perusahaan.
          </p>
        </div>

        <div className="flex gap-2">
          <Link href="/admin/products">
            <Button variant="gold" size="sm" className="font-bold text-xs uppercase tracking-wider">
              <Plus className="w-3.5 h-3.5 mr-1" />
              Tambah Produk
            </Button>
          </Link>
          <Link href="/admin/settings">
            <Button variant="outline" size="sm" className="text-white border-white/20 hover:bg-white/10 text-xs">
              <Settings className="w-3.5 h-3.5 mr-1" />
              Pengaturan
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {metrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <Link key={idx} href={m.href} className="block group">
              <Card hoverEffect className="p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                    {m.title}
                  </span>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${m.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <p className="text-2xl font-bold text-corporate-navy">{m.value}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{m.subValue}</p>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* 2 Columns: Recent RFQs & Recent Inquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Recent RFQs */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex justify-between items-center">
            <div className="space-y-0.5">
              <h3 className="font-bold text-base text-corporate-navy">Permintaan Penawaran Terbaru (RFQ)</h3>
              <p className="text-xs text-gray-500">Antrean permohonan harga yang masuk dari formulir website</p>
            </div>
            <Link href="/admin/rfq">
              <Button variant="outline" size="sm" className="text-xs">
                Kelola Semua RFQ &rarr;
              </Button>
            </Link>
          </div>

          <Card className="overflow-hidden">
            {recentRfqs.length === 0 ? (
              <div className="p-8 text-center text-xs text-gray-400">
                Belum ada permintaan penawaran (RFQ) masuk.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-corporate-light-gray text-corporate-navy font-semibold uppercase text-[10px] tracking-wider border-b border-gray-200">
                    <tr>
                      <th className="py-3 px-4">Nomor RFQ</th>
                      <th className="py-3 px-4">Perusahaan & Pemohon</th>
                      <th className="py-3 px-4">Item Kebutuhan</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {recentRfqs.map((rfq) => (
                      <tr key={rfq.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-corporate-blue">
                          {rfq.rfqNumber}
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-bold text-corporate-navy">{rfq.companyName}</p>
                          <p className="text-[11px] text-gray-500">{rfq.customerName}</p>
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-medium text-gray-800 line-clamp-1">{rfq.targetItem}</p>
                          <p className="text-[10px] text-gray-400">{rfq.quantity}</p>
                        </td>
                        <td className="py-3 px-4">{getStatusBadge(rfq.status)}</td>
                        <td className="py-3 px-4 text-right">
                          <Link href={`/admin/rfq?highlight=${rfq.id}`}>
                            <Button variant="outline" size="sm" className="text-[11px] py-1 px-2.5">
                              Tinjau
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>

        {/* Right: Inquiries & Quick Shortcuts */}
        <div className="lg:col-span-4 space-y-6">
          <div className="space-y-4">
            <h3 className="font-bold text-base text-corporate-navy">Pesan Kontak Masuk</h3>
            <Card className="p-4 space-y-3">
              {recentContacts.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-4">Belum ada pesan masuk.</p>
              ) : (
                <div className="space-y-3">
                  {recentContacts.map((c) => (
                    <div key={c.id} className="p-3 rounded-lg bg-corporate-light-gray/60 space-y-1 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-corporate-navy">{c.name}</span>
                        <span className="text-[10px] text-gray-400">
                          {new Date(c.createdAt).toLocaleDateString("id-ID")}
                        </span>
                      </div>
                      <p className="font-semibold text-corporate-blue text-[11px]">{c.subject}</p>
                      <p className="text-gray-600 line-clamp-2 text-[11px]">{c.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Quick Shortcuts */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs text-corporate-navy uppercase tracking-wider">
              Pintasan Administrasi
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <Link
                href="/admin/products"
                className="p-3 rounded-xl bg-white border border-gray-200 hover:border-corporate-gold hover:shadow-sm transition-all font-semibold text-corporate-navy text-center"
              >
                + Kelola Produk
              </Link>
              <Link
                href="/admin/services"
                className="p-3 rounded-xl bg-white border border-gray-200 hover:border-corporate-gold hover:shadow-sm transition-all font-semibold text-corporate-navy text-center"
              >
                + Kelola Layanan
              </Link>
              <Link
                href="/admin/portfolio"
                className="p-3 rounded-xl bg-white border border-gray-200 hover:border-corporate-gold hover:shadow-sm transition-all font-semibold text-corporate-navy text-center"
              >
                + Portofolio
              </Link>
              <Link
                href="/admin/settings"
                className="p-3 rounded-xl bg-white border border-gray-200 hover:border-corporate-gold hover:shadow-sm transition-all font-semibold text-corporate-navy text-center"
              >
                Pengaturan PT
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

