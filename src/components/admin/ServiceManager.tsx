"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Plus, Edit2, Trash2, Wrench, X, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { safeJsonParse } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
}

interface Service {
  id: string;
  title: string;
  slug: string;
  categoryId: string;
  category: Category;
  shortDesc: string;
  description: string;
  icon: string | null;
  scopeOfWork: string;
  processSteps: string;
  advantages: string;
  isFeatured: boolean;
  isPublished: boolean;
  images: string;
}

interface ServiceManagerProps {
  initialServices: Service[];
  categories: Category[];
}

export function ServiceManager({ initialServices, categories }: ServiceManagerProps) {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    categoryId: categories[0]?.id || "",
    shortDesc: "",
    description: "",
    icon: "Wrench",
    scopeOfWork: '["Survey Lapangan & Analisis", "Pengerjaan Fisik Berstandar K3", "Testing & Commissioning"]',
    processSteps:
      '[{"step":1,"title":"Konsultasi & Survey","desc":"Inspeksi teknis ke lokasi proyek."},{"step":2,"title":"Penyusunan BoQ & SPH","desc":"Penetapan estimasi biaya transparan."},{"step":3,"title":"Eksekusi Pengerjaan","desc":"Pelaksanaan teknis oleh teknisi berlisensi."},{"step":4,"title":"Uji Mutu & Serah Terima","desc":"Penerbitan BAST dan garansi retensi."}]',
    advantages: '["Teknisi Berlisensi Resmi", "Peralatan Ukur Terkalibrasi", "Garansi Purna Jual 12 Bulan"]',
    isFeatured: false,
    isPublished: true,
    images: '["https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80"]',
  });

  const [scopeInputs, setScopeInputs] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const openCreateModal = () => {
    setEditingService(null);
    setFormData({
      title: "",
      categoryId: categories[0]?.id || "",
      shortDesc: "",
      description: "",
      icon: "Wrench",
      scopeOfWork: "",
      processSteps:
        '[{"step":1,"title":"Survey Teknis","desc":"Inspeksi detail ke lokasi kerja."},{"step":2,"title":"Penyusunan RKS","desc":"Penyerahan jadwal kerja dan BoQ."},{"step":3,"title":"Eksekusi Lapangan","desc":"Pengerjaan oleh teknisi bersertifikasi."},{"step":4,"title":"Testing & BAST","desc":"Commissioning dan berita acara resmi."}]',
      advantages: '["Tenaga Ahli Bersertifikat K3", "Jaminan Garansi Resmi", "Dukungan On-Call 24 Jam"]',
      isFeatured: false,
      isPublished: true,
      images: '["https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80"]',
    });
    setScopeInputs(["Survey & Analisis", "Pemasangan Instalasi", "Commissioning & Uji Fungsi"]);
    setErrorMsg("");
    setIsModalOpen(true);
  };

  const openEditModal = (srv: Service) => {
    setEditingService(srv);
    setFormData({
      title: srv.title,
      categoryId: srv.categoryId,
      shortDesc: srv.shortDesc,
      description: srv.description,
      icon: srv.icon || "Wrench",
      scopeOfWork: srv.scopeOfWork,
      processSteps: srv.processSteps,
      advantages: srv.advantages,
      isFeatured: srv.isFeatured,
      isPublished: srv.isPublished,
      images: srv.images,
    });
    setScopeInputs(safeJsonParse<string[]>(srv.scopeOfWork, ["Pekerjaan Standar"]));
    setErrorMsg("");
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const payload = {
        title: formData.title,
        categoryId: formData.categoryId,
        shortDesc: formData.shortDesc,
        description: formData.description,
        icon: formData.icon,
        scopeOfWork: JSON.stringify(scopeInputs.filter((s) => s.trim())),
        processSteps: formData.processSteps,
        advantages: formData.advantages,
        isFeatured: formData.isFeatured,
        isPublished: formData.isPublished,
        images: formData.images,
      };

      const url = "/api/admin/services";
      const method = editingService ? "PUT" : "POST";
      const body = editingService ? { id: editingService.id, ...payload } : payload;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Gagal menyimpan layanan");
      }

      const updated = await fetch("/api/admin/services").then((r) => r.json());
      if (updated.success) setServices(updated.data);

      setIsModalOpen(false);
    } catch (err: any) {
      setErrorMsg(err.message || "Terjadi kesalahan");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus layanan ini?")) return;
    try {
      const res = await fetch(`/api/admin/services?id=${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message);
      setServices(services.filter((s) => s.id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-corporate-navy">Layanan Jasa & Pemeliharaan</h1>
          <p className="text-xs text-gray-500">Kelola daftar layanan teknis, alur proses, dan ruang lingkup pekerjaan</p>
        </div>
        <Button variant="gold" size="sm" onClick={openCreateModal} className="font-bold text-xs uppercase tracking-wider">
          <Plus className="w-4 h-4 mr-1.5" />
          Tambah Layanan Baru
        </Button>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-corporate-light-gray text-corporate-navy font-semibold uppercase text-[10px] tracking-wider border-b border-gray-200">
              <tr>
                <th className="py-3 px-4">Nama Layanan</th>
                <th className="py-3 px-4">Kategori</th>
                <th className="py-3 px-4">Deskripsi Singkat</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {services.map((srv) => (
                <tr key={srv.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 font-bold text-corporate-navy">{srv.title}</td>
                  <td className="py-3 px-4 text-corporate-blue font-semibold">{srv.category.name}</td>
                  <td className="py-3 px-4 text-gray-600 line-clamp-1 max-w-xs">{srv.shortDesc}</td>
                  <td className="py-3 px-4">
                    {srv.isPublished ? (
                      <span className="text-emerald-600 font-semibold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Terbit
                      </span>
                    ) : (
                      <span className="text-gray-400">Draft</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex justify-end gap-1.5">
                      <Button variant="outline" size="sm" onClick={() => openEditModal(srv)} className="p-1.5 h-auto text-corporate-blue">
                        <Edit2 className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => handleDelete(srv.id)} className="p-1.5 h-auto">
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal Form */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingService ? "Edit Layanan Jasa" : "Tambah Layanan Jasa Baru"}
        description="Lengkapi informasi ruang lingkup dan proses pengerjaan jasa."
        maxWidth="2xl"
      >
        <form onSubmit={handleSave} className="space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <Input
            label="Nama Layanan Jasa"
            required
            placeholder="Contoh: Jasa Instalasi & Penggelaran Fiber Optic"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />

          <Select
            label="Kategori Jasa"
            required
            value={formData.categoryId}
            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
            options={categories.map((c) => ({ value: c.id, label: c.name }))}
          />

          <Textarea
            label="Deskripsi Singkat"
            required
            rows={2}
            value={formData.shortDesc}
            onChange={(e) => setFormData({ ...formData, shortDesc: e.target.value })}
          />

          <Textarea
            label="Deskripsi Lengkap"
            required
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />

          {/* Scope list */}
          <div className="space-y-2 border p-4 rounded-xl border-gray-200">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase tracking-wider text-corporate-navy">
                Ruang Lingkup Pekerjaan (Bullet Points)
              </label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setScopeInputs([...scopeInputs, ""])}
                className="text-xs py-1"
              >
                + Tambah Poin
              </Button>
            </div>
            {scopeInputs.map((item, idx) => (
              <div key={idx} className="flex gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => {
                    const up = [...scopeInputs];
                    up[idx] = e.target.value;
                    setScopeInputs(up);
                  }}
                  className="flex-1 text-xs p-2 rounded-lg border border-gray-200 focus:outline-none"
                  placeholder="Contoh: Penarikan kabel underground conduit 500m"
                />
                <button
                  type="button"
                  onClick={() => setScopeInputs(scopeInputs.filter((_, i) => i !== idx))}
                  className="p-1.5 text-rose-500 hover:bg-rose-50 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-4 pt-2">
            <label className="flex items-center gap-2 text-xs font-semibold text-corporate-navy cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
              />
              <span>Tampilkan di Beranda</span>
            </label>
            <label className="flex items-center gap-2 text-xs font-semibold text-corporate-navy cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isPublished}
                onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
              />
              <span>Publikasikan</span>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit" variant="gold" size="sm" isLoading={isSubmitting} className="font-bold text-xs uppercase">
              Simpan Layanan
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

