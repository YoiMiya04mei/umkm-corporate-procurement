import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { articleSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";

export async function GET() {
  try {
    const articles = await prisma.article.findMany({
      include: { category: true },
      orderBy: { publishedAt: "desc" },
    });
    return NextResponse.json({ success: true, data: articles });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Gagal memuat artikel" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const validatedData = articleSchema.parse(body);

    const baseSlug = slugify(validatedData.title);
    let finalSlug = baseSlug;
    const existing = await prisma.article.findUnique({ where: { slug: finalSlug } });
    if (existing) {
      finalSlug = `${baseSlug}-${Date.now().toString().slice(-4)}`;
    }

    const article = await prisma.article.create({
      data: {
        title: validatedData.title,
        slug: finalSlug,
        categoryId: validatedData.categoryId,
        author: validatedData.author,
        thumbnail: validatedData.thumbnail,
        excerpt: validatedData.excerpt,
        content: validatedData.content,
        seoTitle: validatedData.seoTitle || validatedData.title,
        seoDescription: validatedData.seoDescription || validatedData.excerpt,
        isPublished: validatedData.isPublished,
      },
    });

    return NextResponse.json({ success: true, data: article }, { status: 201 });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ success: false, errors: error.errors }, { status: 422 });
    }
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: "ID artikel diperlukan" }, { status: 400 });
    }

    const validatedData = articleSchema.parse(data);

    const updated = await prisma.article.update({
      where: { id },
      data: {
        title: validatedData.title,
        categoryId: validatedData.categoryId,
        author: validatedData.author,
        thumbnail: validatedData.thumbnail,
        excerpt: validatedData.excerpt,
        content: validatedData.content,
        seoTitle: validatedData.seoTitle || validatedData.title,
        seoDescription: validatedData.seoDescription || validatedData.excerpt,
        isPublished: validatedData.isPublished,
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ success: false, errors: error.errors }, { status: 422 });
    }
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, message: "ID artikel diperlukan" }, { status: 400 });
    }

    await prisma.article.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Artikel berhasil dihapus" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
