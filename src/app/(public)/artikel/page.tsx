import React from "react";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { BookOpen, Calendar, User, ArrowRight, Search } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Artikel & Wawasan Pengadaan B2B",
  description:
    "Wawasan pengadaan, tips tender, standar regulasi K3, serta manajemen rantai pasok industri terpercaya dari PT Mitra Karya Pratama.",
};

interface ArticlePageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
  }>;
}

export default async function ArticlesPage({ searchParams }: ArticlePageProps) {
  const params = await searchParams;
  const search = params.search || "";
  const selectedCategory = params.category || "";

  const where: any = { isPublished: true };
  if (selectedCategory) {
    where.category = { slug: selectedCategory };
  }
  if (search) {
    where.OR = [
      { title: { contains: search } },
      { excerpt: { contains: search } },
      { content: { contains: search } },
    ];
  }

  const [categories, articles] = await Promise.all([
    prisma.category.findMany({
      where: { type: "ARTICLE" },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.article.findMany({
      where,
      include: { category: true },
      orderBy: { publishedAt: "desc" },
    }),
  ]);

  return (
    <div className="bg-corporate-light-gray min-h-screen py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="space-y-3">
          <Badge variant="gold">Artikel & Berita</Badge>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-corporate-navy tracking-tight">
            Wawasan Rantai Pasok & Pengadaan Korporasi
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 max-w-2xl">
            Informasi terkini seputar teknik pengadaan, regulasi standar industri, tips memilih vendor resmi, serta kiat efisiensi anggaran B2B.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
          <form method="GET" action="/artikel" className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="search"
              defaultValue={search}
              placeholder="Cari judul artikel..."
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-corporate-blue/20"
            />
            {selectedCategory && <input type="hidden" name="category" value={selectedCategory} />}
          </form>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <Link
              href="/artikel"
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                !selectedCategory ? "bg-corporate-navy text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Semua
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/artikel?category=${cat.slug}`}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                  selectedCategory === cat.slug
                    ? "bg-corporate-navy text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Article Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((art) => (
            <Card key={art.id} hoverEffect className="flex flex-col justify-between">
              <div>
                <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
                  <Image src={art.thumbnail} alt={art.title} fill className="object-cover" />
                  <div className="absolute top-3 left-3">
                    <Badge variant="blue" size="sm">
                      {art.category.name}
                    </Badge>
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <div className="flex items-center gap-3 text-[11px] text-gray-400">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {art.author}
                    </span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(art.publishedAt).toLocaleDateString("id-ID")}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-corporate-navy line-clamp-2 hover:text-corporate-blue transition-colors">
                    <Link href={`/artikel/${art.slug}`}>{art.title}</Link>
                  </h3>

                  <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                    {art.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-gray-50 flex items-center justify-between mt-3">
                <span className="text-[11px] text-gray-400">Waktu baca ~3 menit</span>
                <Link
                  href={`/artikel/${art.slug}`}
                  className="text-xs font-semibold text-corporate-blue hover:text-corporate-navy inline-flex items-center gap-1"
                >
                  Baca Artikel
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
