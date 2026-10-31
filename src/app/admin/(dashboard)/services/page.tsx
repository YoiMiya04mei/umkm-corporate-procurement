import React from "react";
import { prisma } from "@/lib/prisma";
import { ServiceManager } from "@/components/admin/ServiceManager";

export const dynamic = "force-dynamic";

export default async function AdminServicesPage() {
  const [services, categories] = await Promise.all([
    prisma.service.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({
      where: { type: "SERVICE" },
      orderBy: { sortOrder: "asc" },
    }),
  ]);

  return <ServiceManager initialServices={services} categories={categories} />;
}
