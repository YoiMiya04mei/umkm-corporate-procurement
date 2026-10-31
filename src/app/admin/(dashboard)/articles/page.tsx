import React from "react";
import { prisma } from "@/lib/prisma";
import { ArticleManager } from "@/components/admin/ArticleManager";

export const dynamic = "force-dynamic";

export default async function AdminArticlesPage() {
  const [articles, categories] = await Promise.all([
    prisma.article.findMany({
      include: { category: true },
      orderBy: { publishedAt: "desc" },
    }),
    prisma.category.findMany({
      where: { type: "ARTICLE" },
      orderBy: { sortOrder: "asc" },
    }),
  ]);

  const formattedArticles = articles.map((a) => ({
    ...a,
    publishedAt: a.publishedAt.toISOString(),
  }));

  return <ArticleManager initialArticles={formattedArticles} categories={categories} />;
}
