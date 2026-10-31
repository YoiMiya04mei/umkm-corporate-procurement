"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { FileSpreadsheet, Upload, FileText, AlertCircle, CheckCircle2 } from "lucide-react";

interface RfqMainFormProps {
  initialItem?: string;
  initialType?: "BARANG" | "JASA" | "KEDUANYA";
}

export function RfqMainForm({ initialItem = "", initialType = "BARANG" }: RfqMainFormProps) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    customerName: "",
    companyName: "",
    email: "",
    whatsapp: "",
    requestType: initialType,
    targetItem: initialItem,
    quantity: "",
    specifications: "",
    deliveryLocation: "",
    targetDate: "",
    attachmentUrl: "",
    attachmentName: "",
  });

  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setErrorMsg("");

    try {
      const data = new FormData();
      data.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Gagal mengunggah file");
      }

      setFormData((prev) => ({
        ...prev,
        attachmentUrl: json.data.url,
        attachmentName: json.data.originalName,
      }));
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal mengunggah dokumen pendukung");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");
    setFieldErrors({});

    try {
      const res = await fetch("/api/rfq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        if (json.errors) {
          const map: Record<string, string> = {};
          json.errors.forEach((err: any) => {
            map[err.field] = err.message;
          });
          setFieldErrors(map);
          throw new Error("Mohon lengkapi seluruh isian wajib pada formulir");
        }
        throw new Error(json.message || "Gagal memproses RFQ");
      }

      // Navigate to success page with parameters
      router.push(
        `/rfq/sukses?number=${encodeURIComponent(json.data.rfqNumber)}&item=${encodeURIComponent(
          json.data.targetItem
        )}&name=${encodeURIComponent(json.data.customerName)}`
      );
    } catch (err: any) {
      setErrorMsg(err.message || "Terjadi kesalahan pada sistem saat mengirim RFQ");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Section 1: Customer & Company Details */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-corporate-navy uppercase tracking-wider border-b border-gray-100 pb-2">
          1. Identitas Pemohon & Perusahaan
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Nama Lengkap Penanggung Jawab"
            required
            placeholder="Contoh: Ir. Budi Santoso"
            value={formData.customerName}
            onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
            error={fieldErrors.customerName}
          />
          <Input
            label="Nama Perusahaan / Institusi / BUMN"
            required
            placeholder="Contoh: PT Industri Maju Bersama"
            value={formData.companyName}
            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
            error={fieldErrors.companyName}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Alamat Email Resmi Perusahaan"
            type="email"
            required
            placeholder="procurement@perusahaan.co.id"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={fieldErrors.email}
          />
          <Input
            label="Nomor WhatsApp PIC Pengadaan"
            required
            placeholder="Contoh: 081234567890"
            value={formData.whatsapp}
            onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
            error={fieldErrors.whatsapp}
            helperText="Digunakan untuk konfirmasi cepat dan pengiriman draft SPH resmi."
          />
        </div>
      </div>

      {/* Section 2: Procurement Scope */}
      <div className="space-y-4 pt-2">
        <h3 className="text-sm font-bold text-corporate-navy uppercase tracking-wider border-b border-gray-100 pb-2">
          2. Spesifikasi Kebutuhan Barang & Jasa
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Kategori Permintaan"
            required
            value={formData.requestType}
            onChange={(e) =>
              setFormData({
                ...formData,
                requestType: e.target.value as "BARANG" | "JASA" | "KEDUANYA",
              })
            }
            options={[
              { value: "BARANG", label: "Pengadaan Barang (Material / Mesin / IT)" },
              { value: "JASA", label: "Layanan Jasa (Instalasi / M&E / Maintenance)" },
              { value: "KEDUANYA", label: "Paket Terpadu (Barang & Jasa Sekaligus)" },
            ]}
          />
          <Input
            label="Volume / Estimasi Kuantitas"
            required
            placeholder="Contoh: 5 Unit / 250 Meter / 1 Paket Borongan"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            error={fieldErrors.quantity}
          />
        </div>

        <Input
          label="Nama Produk atau Judul Pekerjaan Jasa"
          required
          placeholder="Contoh: Genset Silent Diesel 50 kVA Perkins / Penggelaran Kabel FO 10G"
          value={formData.targetItem}
          onChange={(e) => setFormData({ ...formData, targetItem: e.target.value })}
          error={fieldErrors.targetItem}
        />

        <Textarea
          label="Deskripsi Spesifikasi Teknis Lengkap"
          required
          rows={5}
          placeholder="Jelaskan secara rinci parameter teknis: merek referensi, voltase, dimensi, kapasitas, sertifikasi pengujian yang diwajibkan, toleransi teknis, atau ruang lingkup pekerjaan lapangan..."
          value={formData.specifications}
          onChange={(e) => setFormData({ ...formData, specifications: e.target.value })}
          error={fieldErrors.specifications}
        />
      </div>

      {/* Section 3: Delivery Logistics & Document Attachment */}
      <div className="space-y-4 pt-2">
        <h3 className="text-sm font-bold text-corporate-navy uppercase tracking-wider border-b border-gray-100 pb-2">
          3. Pengiriman & Lampiran Dokumen
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Lokasi Pengiriman / Lokasi Proyek Lapangan"
            required
            placeholder="Contoh: Kawasan Industri KIIC Karawang, Jawa Barat"
            value={formData.deliveryLocation}
            onChange={(e) => setFormData({ ...formData, deliveryLocation: e.target.value })}
            error={fieldErrors.deliveryLocation}
          />
          <Input
            label="Target Waktu Kebutuhan / Deadline SPH"
            placeholder="Contoh: 20 November 2026 / Segera 1 Minggu"
            value={formData.targetDate}
            onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
          />
        </div>

        {/* Upload Doc */}
        <div className="space-y-2 pt-1">
          <label className="block text-xs font-semibold uppercase tracking-wider text-corporate-navy">
            Lampiran Dokumen BoQ / ToR / Gambar Kerja (Opsional)
          </label>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 rounded-xl border border-dashed border-gray-300 bg-corporate-light-gray/60">
            <label className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg text-xs font-semibold bg-white text-corporate-navy hover:bg-gray-50 cursor-pointer shadow-sm shrink-0">
              <Upload className="w-4 h-4 text-corporate-blue" />
              <span>{isUploading ? "Mengunggah..." : "Pilih File Dokumen"}</span>
              <input
                type="file"
                className="hidden"
                onChange={handleFileUpload}
                disabled={isUploading}
                accept=".pdf,.docx,.doc,.xlsx,.xls,.zip,image/*"
              />
            </label>

            {formData.attachmentName ? (
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                <FileText className="w-4 h-4" />
                <span>File terunggah: {formData.attachmentName}</span>
              </div>
            ) : (
              <span className="text-xs text-gray-500">
                Format yang didukung: PDF, DOCX, XLSX, ZIP, Gambar (Maks. 10MB)
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-[11px] text-gray-500">
          *Setelah submit, Anda akan memperoleh <strong>Nomor RFQ Otomatis</strong> untuk tracking status dan penawaran resmi.
        </p>
        <Button
          type="submit"
          variant="gold"
          size="lg"
          isLoading={isSubmitting}
          className="w-full sm:w-auto font-bold uppercase tracking-wider text-xs sm:text-sm shadow-gold"
        >
          <FileSpreadsheet className="w-4 h-4 mr-2" />
          Kirim Permintaan Penawaran (RFQ)
        </Button>
      </div>
    </form>
  );
}

