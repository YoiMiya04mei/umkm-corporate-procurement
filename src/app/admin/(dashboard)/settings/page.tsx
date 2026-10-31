import React from "react";
import { prisma } from "@/lib/prisma";
import { CompanySettingsForm } from "@/components/admin/CompanySettingsForm";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await prisma.companySetting.findUnique({
    where: { id: "default" },
  });

  if (!settings) {
    return <div>Pengaturan perusahaan tidak ditemukan.</div>;
  }

  return <CompanySettingsForm initialSettings={settings} />;
}

