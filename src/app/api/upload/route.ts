import { NextRequest, NextResponse } from "next/server";
import { storage } from "@/lib/storage";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "File tidak ditemukan dalam permintaan" },
        { status: 400 }
      );
    }

    const result = await storage.uploadFile(file);

    return NextResponse.json({
      success: true,
      message: "File berhasil diunggah",
      data: result,
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Gagal mengunggah file" },
      { status: 400 }
    );
  }
}
