"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Plus, Edit2, Trash2, Briefcase, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { safeJsonParse } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
}

interface Portfolio {
  id: string;
  title: string;
  slug: string;
  categoryId: string;
  category: Category;
  clientName: string;
  location: string;
  completionYear: number;
  shortDesc: string;
  description: string;
  images: string;
  isFeatured: boolean;
  isPublished: boolean;
}

interface PortfolioManagerProps {
  initialPortfolios: Portfolio[];
  categories: Category[];
}

export function PortfolioManager({ initialPortfolios, categories }: PortfolioManagerProps) {
  const [portfolios, setPortfolios] = useState<Portfolio[]>(initialPortfolios);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Portfolio | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    categoryId: categories[0]?.id || "",
    clientName: "",
    location: "",
    completionYear: 2025,
    shortDesc: "",
    description: "",
    images: '["https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80"]',
    isFeatured: false,
    isPublished: true,
  });

  const [imageUrl, setImageUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({
      title: "",
      categoryId: categories[0]?.id || "",
      clientName: "",
      location: "",
      completionYear: new Date().getFullYear(),
      shortDesc: "",
      description: "",
      images: '["https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80"]',
      isFeatured: false,
      isPublished: true,
    });
    setErrorMsg("");
    setIsModalOpen(true);
  };

  const openEditModal = (item: Portfolio) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      categoryId: item.categoryId,
      clientName: item.clientName,
      location: item.location,
      completionYear: item.completionYear,
      shortDesc: item.shortDesc,
      description: item.description,
      images: item.images,
      isFeatured: item.isFeatured,
      isPublished: item.isPublished,
    });
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
        clientName: formData.clientName,
        location: formData.location,
        completionYear: Number(formData.completionYear),
        shortDesc: formData.shortDesc,
        description: formData.description,
        images: formData.images,
        isFeatured: formData.isFeatured,
        isPublished: formData.isPublished,
      };

      const url = "/api/admin/portfolio";
      const method = editingItem ? "PUT" : "POST";
      const body = editingItem ? { id: editingItem.id, ...payload } : payload;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || "Gagal menyimpan portofolio");

      const updated = await fetch("/api/admin/portfolio").then((r) => r.json());
      if (updated.success) setPortfolios(updated.data);

      setIsModalOpen(false);
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus portofolio proyek ini?")) return;
    try {
      const res = await fetch(`/api/admin/portfolio?id=${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message);
      setPortfolios(portfolios.filter((p) => p.id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-corporate-navy">Portofolio Proyek Pengadaan</h1>
          <p className="text-xs text-gray-500">Kelola dokumentasi proyek serah terima B2B dan B2G</p>
        </div>
        <Button variant="gold" size="sm" onClick={openCreateModal} className="font-bold text-xs uppercase tracking-wider">
          <Plus className="w-4 h-4 mr-1.5" />
          Tambah Proyek
        </Button>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-corporate-light-gray text-corporate-navy font-semibold uppercase text-[10px] tracking-wider border-b border-gray-200">
              <tr>
                <th className="py-3 px-4">Nama Proyek</th>
                <th className="py-3 px-4">Klien & Lokasi</th>
                <th className="py-3 px-4">Tahun</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {portfolios.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 font-bold text-corporate-navy max-w-xs">{item.title}</td>
                  <td className="py-3 px-4">
                    <p className="font-semibold text-corporate-navy">{item.clientName}</p>
                    <p className="text-[11px] text-gray-500">{item.location}</p>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-corporate-blue">{item.completionYear}</td>
                  <td className="py-3 px-4">
                    {item.isPublished ? (
                      <span className="text-emerald-600 font-semibold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Terbit
                      </span>
                    ) : (
                      <span className="text-gray-400">Draft</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex justify-end gap-1.5">
                      <Button variant="outline" size="sm" onClick={() => openEditModal(item)} className="p-1.5 h-auto text-corporate-blue">
                        <Edit2 className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => handleDelete(item.id)} className="p-1.5 h-auto">
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

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? "Edit Portofolio Proyek" : "Tambah Proyek Baru"}
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
            label="Judul Proyek"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select
              label="Kategori"
              required
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              options={categories.map((c) => ({ value: c.id, label: c.name }))}
            />
            <Input
              label="Nama Klien"
              required
              value={formData.clientName}
              onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
            />
            <Input
              label="Tahun Penyelesaian"
              type="number"
              required
              value={formData.completionYear}
              onChange={(e) => setFormData({ ...formData, completionYear: Number(e.target.value) })}
            />
          </div>

          <Input
            label="Lokasi Pekerjaan"
            required
            placeholder="Contoh: Cikarang, Jawa Barat"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          />

          <Textarea
            label="Ringkasan Singkat"
            required
            rows={2}
            value={formData.shortDesc}
            onChange={(e) => setFormData({ ...formData, shortDesc: e.target.value })}
          />

          <Textarea
            label="Rincian Pelaksanaan Pekerjaan"
            required
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />

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
              Simpan Proyek
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
