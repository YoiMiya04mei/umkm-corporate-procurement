import React from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { User, Bell, ExternalLink } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 py-3.5 px-6 sm:px-8 flex justify-between items-center sticky top-0 z-20 shadow-sm">
          <div>
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Portal Manajemen Operasional
            </h2>
            <p className="text-sm font-bold text-corporate-navy">
              PT Mitra Karya Pratama Mandiri
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              className="text-xs text-corporate-blue hover:text-corporate-navy font-semibold hidden sm:flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Website Publik
            </Link>

            <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
              <div className="w-8 h-8 rounded-full bg-corporate-light-gray border border-gray-300 flex items-center justify-center text-corporate-navy font-bold text-xs">
                <User className="w-4 h-4 text-corporate-blue" />
              </div>
              <div className="hidden sm:block text-left text-xs">
                <p className="font-bold text-corporate-navy leading-tight">{session.name}</p>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
                  {session.role}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-8 flex-1">{children}</main>
      </div>
    </div>
  );
}
