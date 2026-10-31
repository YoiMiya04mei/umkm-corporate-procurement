import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, setSessionCookie, clearSessionCookie, getSession } from "@/lib/auth";
import { loginSchema } from "@/lib/validations";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    // Logout action
    if (action === "logout") {
      await clearSessionCookie();
      return NextResponse.json({ success: true, message: "Berhasil keluar" });
    }

    // Login action
    const validatedData = loginSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Email atau password tidak sesuai" },
        { status: 401 }
      );
    }

    const isMatch = await verifyPassword(validatedData.password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: "Email atau password tidak sesuai" },
        { status: 401 }
      );
    }

    await setSessionCookie({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    return NextResponse.json({
      success: true,
      message: "Login berhasil",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { success: false, message: error.errors[0]?.message || "Validasi gagal" },
        { status: 422 }
      );
    }
    console.error("Auth error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan pada sistem autentikasi" },
      { status: 500 }
    );
  }
}

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  return NextResponse.json({ authenticated: true, user: session });
}

