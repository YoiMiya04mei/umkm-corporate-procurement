import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { productSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    const where: any = {};
    if (category) {
      where.categoryId = category;
    }
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { sku: { contains: search } },
        { brand: { contains: search } },
      ];
    }

    const products = await prisma.product.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Gagal memuat produk" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const validatedData = productSchema.parse(body);

    const baseSlug = slugify(validatedData.title);
    let finalSlug = baseSlug;
    const existing = await prisma.product.findUnique({ where: { slug: finalSlug } });
    if (existing) {
      finalSlug = `${baseSlug}-${Date.now().toString().slice(-4)}`;
    }

    const product = await prisma.product.create({
      data: {
        title: validatedData.title,
        slug: finalSlug,
        sku: validatedData.sku,
        brand: validatedData.brand || null,
        categoryId: validatedData.categoryId,
        shortDesc: validatedData.shortDesc,
        description: validatedData.description,
        specifications: validatedData.specifications,
        price: validatedData.price || null,
        showPrice: validatedData.showPrice,
        availability: validatedData.availability,
        isFeatured: validatedData.isFeatured,
        isPublished: validatedData.isPublished,
        images: validatedData.images,
      },
    });

    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ success: false, errors: error.errors }, { status: 422 });
    }
    return NextResponse.json(
      { success: false, message: error.message || "Gagal membuat produk" },
      { status: 500 }
    );
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
      return NextResponse.json({ success: false, message: "ID produk diperlukan" }, { status: 400 });
    }

    const validatedData = productSchema.parse(data);

    const updated = await prisma.product.update({
      where: { id },
      data: {
        title: validatedData.title,
        sku: validatedData.sku,
        brand: validatedData.brand || null,
        categoryId: validatedData.categoryId,
        shortDesc: validatedData.shortDesc,
        description: validatedData.description,
        specifications: validatedData.specifications,
        price: validatedData.price || null,
        showPrice: validatedData.showPrice,
        availability: validatedData.availability,
        isFeatured: validatedData.isFeatured,
        isPublished: validatedData.isPublished,
        images: validatedData.images,
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ success: false, errors: error.errors }, { status: 422 });
    }
    return NextResponse.json(
      { success: false, message: error.message || "Gagal memperbarui produk" },
      { status: 500 }
    );
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
      return NextResponse.json({ success: false, message: "ID produk diperlukan" }, { status: 400 });
    }

    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Produk berhasil dihapus" });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Gagal menghapus produk" },
      { status: 500 }
    );
  }
}

