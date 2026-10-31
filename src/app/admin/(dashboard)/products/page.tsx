import React from "react";
import { prisma } from "@/lib/prisma";
import { ProductManager } from "@/components/admin/ProductManager";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({
      where: { type: "PRODUCT" },
      orderBy: { sortOrder: "asc" },
    }),
  ]);

  // Format dates to string for client component serialization
  const formattedProducts = products.map((p) => ({
    ...p,
    createdAt: p.createdAt.toISOString(),
  }));

  return <ProductManager initialProducts={formattedProducts} categories={categories} />;
}
