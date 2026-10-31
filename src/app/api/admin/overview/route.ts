import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const [
      totalProducts,
      totalServices,
      totalPortfolio,
      totalArticles,
      totalRfqs,
      newRfqs,
      totalCategories,
      recentRfqs,
      recentContacts,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.service.count(),
      prisma.portfolio.count(),
      prisma.article.count(),
      prisma.rfqRequest.count(),
      prisma.rfqRequest.count({ where: { status: "NEW" } }),
      prisma.category.count(),
      prisma.rfqRequest.findMany({
        take: 6,
        orderBy: { createdAt: "desc" },
      }),
      prisma.contactMessage.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          totalProducts,
          totalServices,
          totalPortfolio,
          totalArticles,
          totalRfqs,
          newRfqs,
          totalCategories,
        },
        recentRfqs,
        recentContacts,
      },
    });
  } catch (error) {
    console.error("Overview error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal memuat ringkasan dashboard" },
      { status: 500 }
    );
  }
}
