import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const settings = await prisma.companySetting.findUnique({
      where: { id: "default" },
    });
    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Gagal memuat pengaturan perusahaan" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();

    const updated = await prisma.companySetting.upsert({
      where: { id: "default" },
      update: {
        name: body.name,
        legalName: body.legalName,
        tagline: body.tagline,
        logoUrl: body.logoUrl,
        faviconUrl: body.faviconUrl,
        description: body.description,
        history: body.history,
        vision: body.vision,
        mission: body.mission,
        coreValues: body.coreValues,
        serviceCommitments: body.serviceCommitments,
        nib: body.nib,
        npwp: body.npwp,
        aktaPendirian: body.aktaPendirian,
        skKemenkumham: body.skKemenkumham,
        certifications: body.certifications,
        address: body.address,
        city: body.city,
        province: body.province,
        postalCode: body.postalCode,
        phone: body.phone,
        whatsapp: body.whatsapp,
        email: body.email,
        operationalHours: body.operationalHours,
        googleMapsEmbed: body.googleMapsEmbed,
        socialLinkedin: body.socialLinkedin,
        socialInstagram: body.socialInstagram,
        socialFacebook: body.socialFacebook,
        socialYoutube: body.socialYoutube,
        statProjects: Number(body.statProjects) || 0,
        statClients: Number(body.statClients) || 0,
        statProducts: Number(body.statProducts) || 0,
        statYears: Number(body.statYears) || 0,
      },
      create: {
        id: "default",
        name: body.name || "PT MITRA KARYA PRATAMA",
        legalName: body.legalName || "PT Mitra Karya Pratama Mandiri",
        tagline: body.tagline || "Solusi Terpercaya Pengadaan Barang dan Layanan Jasa Terpadu",
        logoUrl: body.logoUrl,
        faviconUrl: body.faviconUrl,
        description: body.description || "",
        history: body.history || "",
        vision: body.vision || "",
        mission: body.mission || "[]",
        coreValues: body.coreValues || "[]",
        serviceCommitments: body.serviceCommitments || "[]",
        nib: body.nib || "",
        npwp: body.npwp || "",
        aktaPendirian: body.aktaPendirian || "",
        skKemenkumham: body.skKemenkumham || "",
        certifications: body.certifications || "[]",
        address: body.address || "",
        city: body.city || "",
        province: body.province || "",
        postalCode: body.postalCode || "",
        phone: body.phone || "",
        whatsapp: body.whatsapp || "",
        email: body.email || "",
        operationalHours: body.operationalHours || "",
        googleMapsEmbed: body.googleMapsEmbed || "",
        socialLinkedin: body.socialLinkedin || "",
        socialInstagram: body.socialInstagram || "",
        socialFacebook: body.socialFacebook || "",
        socialYoutube: body.socialYoutube || "",
        statProjects: Number(body.statProjects) || 0,
        statClients: Number(body.statClients) || 0,
        statProducts: Number(body.statProducts) || 0,
        statYears: Number(body.statYears) || 0,
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Gagal memperbarui pengaturan" },
      { status: 500 }
    );
  }
}
