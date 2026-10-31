import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { contactSchema } from "@/lib/validations";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = contactSchema.parse(body);

    const message = await prisma.contactMessage.create({
      data: {
        name: validatedData.name,
        company: validatedData.company || null,
        email: validatedData.email,
        whatsapp: validatedData.whatsapp,
        subject: validatedData.subject,
        message: validatedData.message,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Pesan Anda telah berhasil dikirim. Tim kami akan segera menghubungi Anda.",
        data: message,
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        {
          success: false,
          message: "Data formulir tidak valid",
          errors: error.errors.map((e: any) => ({
            field: e.path.join("."),
            message: e.message,
          })),
        },
        { status: 422 }
      );
    }

    console.error("Contact submission error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan internal pada server" },
      { status: 500 }
    );
  }
}
