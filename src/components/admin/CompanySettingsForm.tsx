"use client";

import React, { useState } from "react";
import { Building2, Save, CheckCircle2, AlertCircle, FileText, Phone, Award, BarChart3, Globe } from "lucide-react";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { safeJsonParse } from "@/lib/utils";

interface CompanySetting {
  id: string;
  name: string;
  legalName: string;
  tagline: string;
  logoUrl: string | null;
  faviconUrl: string | null;
  description: string;
  history: string | null;
  vision: string;
  mission: string;
  coreValues: string;
  serviceCommitments: string;
  nib: string | null;
  npwp: string | null;
  aktaPendirian: string | null;
  skKemenkumham: string | null;
  certifications: string | null;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  phone: string;
  whatsapp: string;
  email: string;
  operationalHours: string;
  googleMapsEmbed: string;
  socialLinkedin: string | null;
  socialInstagram: string | null;
  socialFacebook: string | null;
  socialYoutube: string | null;
  statProjects: number;
  statClients: number;
  statProducts: number;
  statYears: number;
}

interface CompanySettingsFormProps {
  initialSettings: CompanySetting;
}

export function CompanySettingsForm({ initialSettings }: CompanySettingsFormProps) {
  const [formData, setFormData] = useState({
    name: initialSettings.name || "",
    legalName: initialSettings.legalName || "",
    tagline: initialSettings.tagline || "",
    logoUrl: initialSettings.logoUrl || "",
    faviconUrl: initialSettings.faviconUrl || "",
    description: initialSettings.description || "",
    history: initialSettings.history || "",
    vision: initialSettings.vision || "",
    mission: initialSettings.mission || "[]",
    coreValues: initialSettings.coreValues || "[]",
    serviceCommitments: initialSettings.serviceCommitments || "[]",
    nib: initialSettings.nib || "",
    npwp: initialSettings.npwp || "",
    aktaPendirian: initialSettings.aktaPendirian || "",
    skKemenkumham: initialSettings.skKemenkumham || "",
    certifications: initialSettings.certifications || "[]",
    address: initialSettings.address || "",
    city: initialSettings.city || "",
    province: initialSettings.province || "",
    postalCode: initialSettings.postalCode || "",
    phone: initialSettings.phone || "",
    whatsapp: initialSettings.whatsapp || "",
    email: initialSettings.email || "",
    operationalHours: initialSettings.operationalHours || "",
    googleMapsEmbed: initialSettings.googleMapsEmbed || "",
    socialLinkedin: initialSettings.socialLinkedin || "",
    socialInstagram: initialSettings.socialInstagram || "",
    socialFacebook: initialSettings.socialFacebook || "",
    socialYoutube: initialSettings.socialYoutube || "",
    statProjects: initialSettings.statProjects || 0,
    statClients: initialSettings.statClients || 0,
    statProducts: initialSettings.statProducts || 0,
    statYears: initialSettings.statYears || 0,
  });

  const [activeTab, setActiveTab] = useState<"general" | "legal" | "contact" | "stats" | "vision">("general");
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Gagal memperbarui pengaturan");
      }

      setSuccessMsg("Informasi profil perusahaan berhasil disimpan!");
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-corporate-navy">
            Pengaturan Profil & Website Perusahaan
          </h1>
          <p className="text-xs text-gray-500">
            Seluruh data perusahaan, nomor kontak, legalitas, dan angka statistik dapat diubah secara dinamis
          </p>
        </div>
        <Button
          type="submit"
          variant="gold"
          size="sm"
          isLoading={isSaving}
          className="font-bold text-xs uppercase tracking-wider shadow-gold"
        >
          <Save className="w-4 h-4 mr-1.5" />
          Simpan Seluruh Perubahan
        </Button>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Setting Category Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-3">
        {[
          { id: "general", label: "Identitas Utama", icon: Building2 },
          { id: "legal", label: "Legalitas & Izin", icon: FileText },
          { id: "contact", label: "Kontak & Alamat", icon: Phone },
          { id: "stats", label: "Statistik Dashboard", icon: BarChart3 },
          { id: "vision", label: "Visi, Misi & Nilai", icon: Award },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                isActive
                  ? "bg-corporate-navy text-white shadow-sm"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: General Identity */}
      {activeTab === "general" && (
        <Card className="p-6 sm:p-8 space-y-4">
          <div className="border-b border-gray-100 pb-3">
            <h3 className="font-bold text-base text-corporate-navy">Identitas Badan Usaha</h3>
            <p className="text-xs text-gray-500">Nama resmi yang tampil di kop surat, navbar, dan footer</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Nama Brand Perusahaan"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <Input
              label="Nama Lengkap Badan Hukum"
              required
              value={formData.legalName}
              onChange={(e) => setFormData({ ...formData, legalName: e.target.value })}
            />
          </div>

          <Input
            label="Tagline / Slogan Bisnis"
            value={formData.tagline}
            onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
          />

          <Textarea
            label="Deskripsi Profil Singkat Perusahaan"
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />

          <Textarea
            label="Sejarah Perusahaan (Halaman Tentang Kami)"
            rows={4}
            value={formData.history}
            onChange={(e) => setFormData({ ...formData, history: e.target.value })}
          />
        </Card>
      )}

      {/* Tab 2: Legalities */}
      {activeTab === "legal" && (
        <Card className="p-6 sm:p-8 space-y-4">
          <div className="border-b border-gray-100 pb-3">
            <h3 className="font-bold text-base text-corporate-navy">Dokumen Legalitas & Perizinan Berusaha</h3>
            <p className="text-xs text-gray-500">
              Isi sesuai dokumen resmi perusahaan Anda. Data ini tampil di bagian legalitas dan footer.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Nomor Induk Berusaha (NIB)"
              value={formData.nib}
              onChange={(e) => setFormData({ ...formData, nib: e.target.value })}
              placeholder="Contoh: 0220101234567"
            />
            <Input
              label="Nomor Pokok Wajib Pajak (NPWP)"
              value={formData.npwp}
              onChange={(e) => setFormData({ ...formData, npwp: e.target.value })}
              placeholder="Contoh: 01.234.567.8-012.000"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Nomor Akta Notaris Pendirian"
              value={formData.aktaPendirian}
              onChange={(e) => setFormData({ ...formData, aktaPendirian: e.target.value })}
              placeholder="Akta Notaris No..."
            />
            <Input
              label="Nomor SK Kemenkumham"
              value={formData.skKemenkumham}
              onChange={(e) => setFormData({ ...formData, skKemenkumham: e.target.value })}
              placeholder="AHU-0012345..."
            />
          </div>

          <Textarea
            label="Daftar Sertifikasi & KBLI (JSON Format)"
            rows={3}
            value={formData.certifications}
            onChange={(e) => setFormData({ ...formData, certifications: e.target.value })}
            helperText='Contoh format: ["Sertifikat Standar KBLI 4659", "Sertifikasi K3 SMK3"]'
          />
        </Card>
      )}

      {/* Tab 3: Contact & Address */}
      {activeTab === "contact" && (
        <Card className="p-6 sm:p-8 space-y-4">
          <div className="border-b border-gray-100 pb-3">
            <h3 className="font-bold text-base text-corporate-navy">Kontak & Lokasi Kantor</h3>
            <p className="text-xs text-gray-500">Informasi komunikasi resmi dan peta Google Maps</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Telepon Kantor"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            <Input
              label="Nomor WhatsApp Pengadaan"
              value={formData.whatsapp}
              onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
              helperText="Awali dengan 62 (contoh: 6281234567890)"
            />
            <Input
              label="Email Resmi"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <Input
            label="Alamat Lengkap Kantor / Gudang"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Kota / Kabupaten"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            />
            <Input
              label="Provinsi"
              value={formData.province}
              onChange={(e) => setFormData({ ...formData, province: e.target.value })}
            />
            <Input
              label="Kode Pos"
              value={formData.postalCode}
              onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
            />
          </div>

          <Input
            label="Jam Operasional Kantor"
            value={formData.operationalHours}
            onChange={(e) => setFormData({ ...formData, operationalHours: e.target.value })}
            placeholder="Senin - Jumat: 08:30 - 17:30 WIB"
          />

          <Textarea
            label="Google Maps Embed URL (Iframe Src)"
            rows={2}
            value={formData.googleMapsEmbed}
            onChange={(e) => setFormData({ ...formData, googleMapsEmbed: e.target.value })}
            helperText="Masukkan URL yang ada di dalam parameter src='https://www.google.com/maps/embed?...'"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <Input
              label="URL LinkedIn Perusahaan"
              value={formData.socialLinkedin}
              onChange={(e) => setFormData({ ...formData, socialLinkedin: e.target.value })}
            />
            <Input
              label="URL Instagram Perusahaan"
              value={formData.socialInstagram}
              onChange={(e) => setFormData({ ...formData, socialInstagram: e.target.value })}
            />
          </div>
        </Card>
      )}

      {/* Tab 4: Dynamic Statistics */}
      {activeTab === "stats" && (
        <Card className="p-6 sm:p-8 space-y-4">
          <div className="border-b border-gray-100 pb-3">
            <h3 className="font-bold text-base text-corporate-navy">Angka Statistik Pencapaian (Key Figures)</h3>
            <p className="text-xs text-gray-500">
              Angka ini ditampilkan di hero section, trust badges, dan counter statistik beranda.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Input
              label="Total Proyek Selesai"
              type="number"
              value={formData.statProjects}
              onChange={(e) => setFormData({ ...formData, statProjects: Number(e.target.value) })}
            />
            <Input
              label="Jumlah Klien Korporasi"
              type="number"
              value={formData.statClients}
              onChange={(e) => setFormData({ ...formData, statClients: Number(e.target.value) })}
            />
            <Input
              label="Katalog Produk / Item"
              type="number"
              value={formData.statProducts}
              onChange={(e) => setFormData({ ...formData, statProducts: Number(e.target.value) })}
            />
            <Input
              label="Tahun Pengalaman Kerja"
              type="number"
              value={formData.statYears}
              onChange={(e) => setFormData({ ...formData, statYears: Number(e.target.value) })}
            />
          </div>
        </Card>
      )}

      {/* Tab 5: Vision, Mission & Values */}
      {activeTab === "vision" && (
        <Card className="p-6 sm:p-8 space-y-4">
          <div className="border-b border-gray-100 pb-3">
            <h3 className="font-bold text-base text-corporate-navy">Visi, Misi & Budaya Perusahaan</h3>
            <p className="text-xs text-gray-500">Pernyataan komitmen perusahaan di halaman Tentang Kami</p>
          </div>

          <Textarea
            label="Visi Perusahaan"
            rows={3}
            value={formData.vision}
            onChange={(e) => setFormData({ ...formData, vision: e.target.value })}
          />

          <Textarea
            label="Misi Perusahaan (JSON Array)"
            rows={4}
            value={formData.mission}
            onChange={(e) => setFormData({ ...formData, mission: e.target.value })}
            helperText='Contoh format: ["Menyediakan produk berkualitas...", "Memberikan pelayanan prima..."]'
          />

          <Textarea
            label="Nilai-Nilai Utama (Core Values - JSON Array)"
            rows={4}
            value={formData.coreValues}
            onChange={(e) => setFormData({ ...formData, coreValues: e.target.value })}
            helperText='Contoh format: [{"title":"Integritas","desc":"..."},{"title":"Kualitas","desc":"..."}]'
          />
        </Card>
      )}

      <div className="flex justify-end pt-2">
        <Button
          type="submit"
          variant="gold"
          size="lg"
          isLoading={isSaving}
          className="font-bold uppercase tracking-wider text-xs shadow-gold"
        >
          <Save className="w-4 h-4 mr-2" />
          Simpan Semua Pengaturan
        </Button>
      </div>
    </form>
  );
}
