import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { portfolioSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";

export async function GET() {
  try {
    const portfolios = await prisma.portfolio.findMany({
      include: { category: true },
      orderBy: { completionYear: "desc" },
    });
    return NextResponse.json({ success: true, data: portfolios });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Gagal memuat portofolio" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const validatedData = portfolioSchema.parse(body);

    const baseSlug = slugify(validatedData.title);
    let finalSlug = baseSlug;
    const existing = await prisma.portfolio.findUnique({ where: { slug: finalSlug } });
    if (existing) {
      finalSlug = `${baseSlug}-${Date.now().toString().slice(-4)}`;
    }

    const portfolio = await prisma.portfolio.create({
      data: {
        title: validatedData.title,
        slug: finalSlug,
        categoryId: validatedData.categoryId,
        clientName: validatedData.clientName,
        location: validatedData.location,
        completionYear: validatedData.completionYear,
        shortDesc: validatedData.shortDesc,
        description: validatedData.description,
        images: validatedData.images,
        isFeatured: validatedData.isFeatured,
        isPublished: validatedData.isPublished,
      },
    });

    return NextResponse.json({ success: true, data: portfolio }, { status: 201 });
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
      return NextResponse.json({ success: false, message: "ID portofolio diperlukan" }, { status: 400 });
    }

    const validatedData = portfolioSchema.parse(data);

    const updated = await prisma.portfolio.update({
      where: { id },
      data: {
        title: validatedData.title,
        categoryId: validatedData.categoryId,
        clientName: validatedData.clientName,
        location: validatedData.location,
        completionYear: validatedData.completionYear,
        shortDesc: validatedData.shortDesc,
        description: validatedData.description,
        images: validatedData.images,
        isFeatured: validatedData.isFeatured,
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
      return NextResponse.json({ success: false, message: "ID portofolio diperlukan" }, { status: 400 });
    }

    await prisma.portfolio.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Portofolio berhasil dihapus" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

