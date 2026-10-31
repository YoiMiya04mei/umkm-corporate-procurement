"use client";

import React, { useState } from "react";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { CheckCircle2, AlertCircle, Send } from "lucide-react";

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    whatsapp: "",
    subject: "",
    message: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMsg("");
    setErrorMsg("");
    setErrors({});

    try {
      const res = await fetch("/api/contact", {
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
          setErrors(map);
          throw new Error("Mohon periksa kembali isian formulir");
        }
        throw new Error(json.message || "Gagal mengirim pesan");
      }

      setSuccessMsg(json.message || "Pesan Anda telah berhasil terkirim!");
      setFormData({
        name: "",
        company: "",
        email: "",
        whatsapp: "",
        subject: "",
        message: "",
      });
    } catch (err: any) {
      setErrorMsg(err.message || "Terjadi kesalahan saat mengirim pesan");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Nama Lengkap"
          required
          placeholder="Nama Anda"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          error={errors.name}
        />
        <Input
          label="Nama Perusahaan / Organisasi"
          placeholder="PT / CV / Instansi (Opsional)"
          value={formData.company}
          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
          error={errors.company}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Alamat Email"
          type="email"
          required
          placeholder="nama@perusahaan.co.id"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          error={errors.email}
        />
        <Input
          label="Nomor WhatsApp"
          required
          placeholder="Contoh: 081234567890"
          value={formData.whatsapp}
          onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
          error={errors.whatsapp}
        />
      </div>

      <Input
        label="Subjek Pesan"
        required
        placeholder="Contoh: Permohonan Penawaran Kerjasama Vendor Pengadaan"
        value={formData.subject}
        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
        error={errors.subject}
      />

      <Textarea
        label="Pesan / Kebutuhan Anda"
        required
        rows={4}
        placeholder="Tuliskan detail pertanyaan atau kebutuhan yang ingin Anda konsultasikan..."
        value={formData.message}
        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        error={errors.message}
      />

      <Button
        type="submit"
        variant="gold"
        size="md"
        isLoading={isLoading}
        className="w-full sm:w-auto font-bold uppercase tracking-wider text-xs shadow-gold"
      >
        <Send className="w-4 h-4 mr-2" />
        Kirim Pesan Sekarang
      </Button>
    </form>
  );
}

