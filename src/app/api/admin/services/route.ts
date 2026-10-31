import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { serviceSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, data: services });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Gagal memuat layanan" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const validatedData = serviceSchema.parse(body);

    const baseSlug = slugify(validatedData.title);
    let finalSlug = baseSlug;
    const existing = await prisma.service.findUnique({ where: { slug: finalSlug } });
    if (existing) {
      finalSlug = `${baseSlug}-${Date.now().toString().slice(-4)}`;
    }

    const service = await prisma.service.create({
      data: {
        title: validatedData.title,
        slug: finalSlug,
        categoryId: validatedData.categoryId,
        shortDesc: validatedData.shortDesc,
        description: validatedData.description,
        icon: validatedData.icon || "Wrench",
        scopeOfWork: validatedData.scopeOfWork,
        processSteps: validatedData.processSteps,
        advantages: validatedData.advantages,
        isFeatured: validatedData.isFeatured,
        isPublished: validatedData.isPublished,
        images: validatedData.images,
      },
    });

    return NextResponse.json({ success: true, data: service }, { status: 201 });
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
      return NextResponse.json({ success: false, message: "ID layanan diperlukan" }, { status: 400 });
    }

    const validatedData = serviceSchema.parse(data);

    const updated = await prisma.service.update({
      where: { id },
      data: {
        title: validatedData.title,
        categoryId: validatedData.categoryId,
        shortDesc: validatedData.shortDesc,
        description: validatedData.description,
        icon: validatedData.icon || "Wrench",
        scopeOfWork: validatedData.scopeOfWork,
        processSteps: validatedData.processSteps,
        advantages: validatedData.advantages,
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
      return NextResponse.json({ success: false, message: "ID layanan diperlukan" }, { status: 400 });
    }

    await prisma.service.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Layanan berhasil dihapus" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
