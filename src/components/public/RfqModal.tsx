"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { CheckCircle2, Upload, FileText, AlertCircle } from "lucide-react";
import { getWhatsAppUrl } from "@/lib/utils";

interface RfqModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefilledItem?: string;
  prefilledType?: "BARANG" | "JASA" | "KEDUANYA";
}

export function RfqModal({
  isOpen,
  onClose,
  prefilledItem = "",
  prefilledType = "BARANG",
}: RfqModalProps) {
  const [formData, setFormData] = useState({
    customerName: "",
    companyName: "",
    email: "",
    whatsapp: "",
    requestType: prefilledType,
    targetItem: prefilledItem,
    quantity: "1 Unit / Paket",
    specifications: "",
    deliveryLocation: "",
    targetDate: "",
    attachmentUrl: "",
    attachmentName: "",
  });

  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [submittedRfq, setSubmittedRfq] = useState<{
    rfqNumber: string;
    customerName: string;
    targetItem: string;
  } | null>(null);

  // Sync prefilled values when modal opens
  React.useEffect(() => {
    if (prefilledItem) {
      setFormData((prev) => ({
        ...prev,
        targetItem: prefilledItem,
        requestType: prefilledType,
      }));
    }
  }, [prefilledItem, prefilledType]);

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
      setErrorMsg(err.message || "Gagal upload dokumen lampiran");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/rfq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Gagal mengirimkan RFQ");
      }

      setSubmittedRfq({
        rfqNumber: json.data.rfqNumber,
        customerName: json.data.customerName,
        targetItem: json.data.targetItem,
      });
    } catch (err: any) {
      setErrorMsg(err.message || "Terjadi kesalahan saat memproses RFQ");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmittedRfq(null);
    setFormData({
      customerName: "",
      companyName: "",
      email: "",
      whatsapp: "",
      requestType: "BARANG",
      targetItem: "",
      quantity: "1 Unit / Paket",
      specifications: "",
      deliveryLocation: "",
      targetDate: "",
      attachmentUrl: "",
      attachmentName: "",
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleReset}
      title="Request for Quotation (RFQ)"
      description="Ajukan permintaan harga resmi atau proposal teknis pengadaan untuk instansi/korporasi Anda."
      maxWidth="2xl"
    >
      {submittedRfq ? (
        <div className="text-center py-6 space-y-4">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h4 className="text-xl font-bold text-corporate-navy">
            Permintaan Penawaran Berhasil Diterima!
          </h4>
          <div className="bg-corporate-light-gray p-4 rounded-xl border border-gray-200 text-sm max-w-md mx-auto space-y-2 text-left">
            <div className="flex justify-between items-center pb-2 border-b border-gray-200">
              <span className="text-xs text-gray-500 font-semibold uppercase">Nomor RFQ:</span>
              <span className="font-mono font-bold text-corporate-blue text-base">
                {submittedRfq.rfqNumber}
              </span>
            </div>
            <div className="text-xs text-gray-600">
              <p>
                <strong>Kebutuhan:</strong> {submittedRfq.targetItem}
              </p>
              <p>
                <strong>Nama Pemohon:</strong> {submittedRfq.customerName}
              </p>
            </div>
          </div>

          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Tim estimasi kami akan meninjau spesifikasi dan menerbitkan Surat Penawaran Harga (SPH) resmi dalam 1x24 jam kerja.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-3 pt-3">
            <a
              href={getWhatsAppUrl(
                "6281234567890",
                `Halo Tim Pengadaan PT Mitra Karya Pratama, saya telah mengajukan RFQ via website dengan Nomor: *${submittedRfq.rfqNumber}* untuk item *${submittedRfq.targetItem}*. Mohon bantuannya untuk tindak lanjut.`
              )}
              target="_blank"
              rel="noreferrer"
            >
              <Button variant="gold" size="sm" className="w-full">
                Konfirmasi Cepat via WhatsApp
              </Button>
            </a>
            <Button variant="outline" size="sm" onClick={handleReset}>
              Tutup Formulir
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Nama Lengkap Pemohon"
              required
              placeholder="Contoh: Bpk. Budi Santoso"
              value={formData.customerName}
              onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
            />
            <Input
              label="Nama Perusahaan / Institusi"
              required
              placeholder="Contoh: PT Industri Maju Bersama"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Email Perusahaan / Resmi"
              type="email"
              required
              placeholder="nama@perusahaan.co.id"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <Input
              label="Nomor WhatsApp PIC"
              required
              placeholder="Contoh: 081234567890"
              value={formData.whatsapp}
              onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Jenis Pengadaan"
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
                { value: "KEDUANYA", label: "Paket Pengadaan Barang & Jasa Sekaligus" },
              ]}
            />
            <Input
              label="Volume / Jumlah Estimasi"
              required
              placeholder="Contoh: 5 Unit / 1 Paket Borongan"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            />
          </div>

          <Input
            label="Nama Produk / Judul Pekerjaan Jasa"
            required
            placeholder="Contoh: Genset Silent Diesel 50 kVA Perkins"
            value={formData.targetItem}
            onChange={(e) => setFormData({ ...formData, targetItem: e.target.value })}
          />

          <Textarea
            label="Spesifikasi Kebutuhan & Ruang Lingkup"
            required
            rows={3}
            placeholder="Tuliskan detail spesifikasi teknis, merek referensi, kapasitas, standar pengujian, atau lingkup pekerjaan yang dibutuhkan..."
            value={formData.specifications}
            onChange={(e) => setFormData({ ...formData, specifications: e.target.value })}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Lokasi Pengiriman / Lokasi Proyek"
              required
              placeholder="Contoh: Kawasan Industri MM2100 Cikarang"
              value={formData.deliveryLocation}
              onChange={(e) => setFormData({ ...formData, deliveryLocation: e.target.value })}
            />
            <Input
              label="Target Waktu Kebutuhan"
              placeholder="Contoh: Akhir Bulan Ini / Pertengahan Nov 2026"
              value={formData.targetDate}
              onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
            />
          </div>

          {/* File Upload Section */}
          <div className="space-y-1.5 pt-1">
            <label className="block text-xs font-semibold uppercase tracking-wider text-corporate-navy">
              Lampiran Dokumen BoQ / ToR / Gambar Kerja (Opsional)
            </label>
            <div className="flex items-center gap-3">
              <label className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-xs font-medium bg-white text-gray-700 hover:bg-gray-50 cursor-pointer shadow-sm">
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
                <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5" />
                  {formData.attachmentName}
                </span>
              ) : (
                <span className="text-xs text-gray-400">
                  Maks. 10MB (PDF, DOCX, XLSX, ZIP, Gambar)
                </span>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
            <Button type="button" variant="outline" size="sm" onClick={handleReset}>
              Batal
            </Button>
            <Button
              type="submit"
              variant="gold"
              size="sm"
              isLoading={isSubmitting}
              className="font-bold uppercase tracking-wider"
            >
              Kirim Permintaan Penawaran
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}

