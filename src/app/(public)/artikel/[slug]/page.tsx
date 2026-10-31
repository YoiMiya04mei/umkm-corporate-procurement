import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ArrowLeft, Calendar, User, Share2, Tag, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export const dynamic = "force-dynamic";

interface ArticleDetailProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ArticleDetailProps) {
  const { slug } = await params;
  const article = await prisma.article.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!article) return { title: "Artikel Tidak Ditemukan" };

  return {
    title: article.seoTitle || article.title,
    description: article.seoDescription || article.excerpt,
  };
}

export default async function ArticleDetailPage({ params }: ArticleDetailProps) {
  const { slug } = await params;

  const article = await prisma.article.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!article || !article.isPublished) {
    notFound();
  }

  // Increment views
  await prisma.article
    .update({
      where: { id: article.id },
      data: { views: { increment: 1 } },
    })
    .catch(() => {});

  const recentArticles = await prisma.article.findMany({
    where: {
      id: { not: article.id },
      isPublished: true,
    },
    include: { category: true },
    take: 3,
    orderBy: { publishedAt: "desc" },
  });

  return (
    <div className="bg-corporate-light-gray min-h-screen py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <Link
            href="/artikel"
            className="inline-flex items-center text-xs font-semibold text-corporate-navy hover:text-corporate-blue transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Kembali ke Semua Artikel
          </Link>
        </div>

        <article className="bg-white rounded-2xl border border-gray-200 shadow-corporate overflow-hidden">
          <div className="p-6 sm:p-10 space-y-4">
            <Badge variant="gold">{article.category.name}</Badge>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-corporate-navy tracking-tight leading-tight">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 pt-2 border-b border-gray-100 pb-4">
              <span className="flex items-center gap-1.5 font-medium text-corporate-navy">
                <User className="w-3.5 h-3.5 text-corporate-blue" />
                {article.author}
              </span>
              <span>&bull;</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(article.publishedAt).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <span>&bull;</span>
              <span>Dilihat: {article.views} kali</span>
            </div>

            {/* Thumbnail */}
            <div className="relative h-72 sm:h-96 w-full rounded-xl overflow-hidden my-6">
              <Image src={article.thumbnail} alt={article.title} fill className="object-cover" priority />
            </div>

            {/* Content Body */}
            <div
              className="prose prose-corporate max-w-none text-xs sm:text-sm text-gray-700 leading-relaxed space-y-4"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </div>

          {/* Share & Tag Footer */}
          <div className="bg-corporate-light-gray/60 p-6 sm:p-8 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Tag className="w-4 h-4 text-corporate-gold" />
              <span>Topik: Pengadaan Barang, Vendor Rekanan, Manajemen Rantai Pasok B2B</span>
            </div>
            <Link href="/rfq">
              <Button variant="gold" size="sm" className="text-xs font-bold uppercase tracking-wider">
                Minta Penawaran Pengadaan
              </Button>
            </Link>
          </div>
        </article>

        {/* Recent Articles */}
        {recentArticles.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-corporate-navy">Artikel Terkait Lainnya</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {recentArticles.map((rec) => (
                <Link
                  key={rec.id}
                  href={`/artikel/${rec.slug}`}
                  className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-corporate hover:-translate-y-1 transition-all space-y-2 block"
                >
                  <p className="text-[11px] text-corporate-gold font-semibold">{rec.category.name}</p>
                  <h4 className="font-bold text-xs text-corporate-navy line-clamp-2">{rec.title}</h4>
                  <p className="text-[11px] text-gray-500 line-clamp-2">{rec.excerpt}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
