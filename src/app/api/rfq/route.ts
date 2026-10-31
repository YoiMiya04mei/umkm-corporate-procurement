import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rfqSchema } from "@/lib/validations";
import { generateRfqNumber } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = rfqSchema.parse(body);

    const rfqNumber = generateRfqNumber();

    const createdRfq = await prisma.rfqRequest.create({
      data: {
        rfqNumber,
        customerName: validatedData.customerName,
        companyName: validatedData.companyName,
        email: validatedData.email,
        whatsapp: validatedData.whatsapp,
        requestType: validatedData.requestType,
        targetItem: validatedData.targetItem,
        quantity: validatedData.quantity,
        specifications: validatedData.specifications,
        deliveryLocation: validatedData.deliveryLocation,
        targetDate: validatedData.targetDate || null,
        attachmentUrl: validatedData.attachmentUrl || null,
        attachmentName: validatedData.attachmentName || null,
        status: "NEW",
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Permintaan penawaran (RFQ) berhasil diajukan",
        data: createdRfq,
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        {
          success: false,
          message: "Validasi gagal",
          errors: error.errors.map((e: any) => ({
            field: e.path.join("."),
            message: e.message,
          })),
        },
        { status: 422 }
      );
    }

    console.error("RFQ submission error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan internal pada server" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const rfqNumber = searchParams.get("number");

    if (!rfqNumber) {
      return NextResponse.json(
        { success: false, message: "Nomor RFQ diperlukan" },
        { status: 400 }
      );
    }

    const rfq = await prisma.rfqRequest.findUnique({
      where: { rfqNumber },
      select: {
        rfqNumber: true,
        customerName: true,
        companyName: true,
        requestType: true,
        targetItem: true,
        status: true,
        createdAt: true,
      },
    });

    if (!rfq) {
      return NextResponse.json(
        { success: false, message: "Nomor RFQ tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: rfq });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Gagal mengambil data RFQ" },
      { status: 500 }
    );
  }
}
