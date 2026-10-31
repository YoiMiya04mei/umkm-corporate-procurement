import React from "react";
import { prisma } from "@/lib/prisma";
import { PortfolioManager } from "@/components/admin/PortfolioManager";

export const dynamic = "force-dynamic";

export default async function AdminPortfolioPage() {
  const [portfolios, categories] = await Promise.all([
    prisma.portfolio.findMany({
      include: { category: true },
      orderBy: { completionYear: "desc" },
    }),
    prisma.category.findMany({
      where: { type: "PORTFOLIO" },
      orderBy: { sortOrder: "asc" },
    }),
  ]);

  return <PortfolioManager initialPortfolios={portfolios} categories={categories} />;
}
