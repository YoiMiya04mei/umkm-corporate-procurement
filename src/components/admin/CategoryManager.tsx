"use client";

import React, { useState } from "react";
import { Plus, Edit2, Trash2, Tags, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";

interface Category {
  id: string;
  name: string;
  slug: string;
  type: string;
  description: string | null;
  sortOrder: number;
  _count?: {
    products: number;
    services: number;
    portfolios: number;
    articles: number;
  };
}

interface CategoryManagerProps {
  initialCategories: Category[];
}

export function CategoryManager({ initialCategories }: CategoryManagerProps) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [selectedType, setSelectedType] = useState("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<Category | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    type: "PRODUCT" as "PRODUCT" | "SERVICE" | "PORTFOLIO" | "ARTICLE",
    description: "",
    sortOrder: 0,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const filteredCategories = categories.filter((c) =>
    selectedType === "ALL" ? true : c.type === selectedType
  );

  const openCreateModal = () => {
    setEditingCat(null);
    setFormData({
      name: "",
      type: "PRODUCT",
      description: "",
      sortOrder: categories.length + 1,
    });
    setErrorMsg("");
    setIsModalOpen(true);
  };

  const openEditModal = (c: Category) => {
    setEditingCat(c);
    setFormData({
      name: c.name,
      type: c.type as any,
      description: c.description || "",
      sortOrder: c.sortOrder,
    });
    setErrorMsg("");
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const url = "/api/admin/categories";
      const method = editingCat ? "PUT" : "POST";
      const body = editingCat ? { id: editingCat.id, ...formData } : formData;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || "Gagal menyimpan kategori");

      const updated = await fetch("/api/admin/categories").then((r) => r.json());
      if (updated.success) setCategories(updated.data);

      setIsModalOpen(false);
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus kategori ini? Data terkait dapat terpengaruh.")) return;
    try {
      const res = await fetch(`/api/admin/categories?id=${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message);
      setCategories(categories.filter((c) => c.id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-corporate-navy">Kelola Kategori Sistem</h1>
          <p className="text-xs text-gray-500">Kelola kategori produk, layanan jasa, portofolio, dan artikel</p>
        </div>
        <Button variant="gold" size="sm" onClick={openCreateModal} className="font-bold text-xs uppercase tracking-wider">
          <Plus className="w-4 h-4 mr-1.5" />
          Tambah Kategori
        </Button>
      </div>

      {/* Type Filter */}
      <div className="flex gap-2">
        {["ALL", "PRODUCT", "SERVICE", "PORTFOLIO", "ARTICLE"].map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
              selectedType === type
                ? "bg-corporate-navy text-white"
                : "bg-white text-gray-600 border border-gray-200"
            }`}
          >
            {type === "ALL" ? "Semua" : type}
          </button>
        ))}
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-corporate-light-gray text-corporate-navy font-semibold uppercase text-[10px] tracking-wider border-b border-gray-200">
              <tr>
                <th className="py-3 px-4">Nama Kategori</th>
                <th className="py-3 px-4">Tipe Modul</th>
                <th className="py-3 px-4">Slug URL</th>
                <th className="py-3 px-4">Urutan</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCategories.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 font-bold text-corporate-navy">{c.name}</td>
                  <td className="py-3 px-4">
                    <Badge variant="blue" size="sm">{c.type}</Badge>
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-gray-500">{c.slug}</td>
                  <td className="py-3 px-4 font-semibold text-corporate-navy">{c.sortOrder}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex justify-end gap-1.5">
                      <Button variant="outline" size="sm" onClick={() => openEditModal(c)} className="p-1.5 h-auto text-corporate-blue">
                        <Edit2 className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => handleDelete(c.id)} className="p-1.5 h-auto">
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
        title={editingCat ? "Edit Kategori" : "Tambah Kategori Baru"}
        maxWidth="md"
      >
        <form onSubmit={handleSave} className="space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <Input
            label="Nama Kategori"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <Select
            label="Tipe Modul"
            required
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
            options={[
              { value: "PRODUCT", label: "Produk Pengadaan" },
              { value: "SERVICE", label: "Layanan Jasa" },
              { value: "PORTFOLIO", label: "Portofolio Proyek" },
              { value: "ARTICLE", label: "Artikel & Berita" },
            ]}
          />

          <Input
            label="Nomor Urutan Tampilan"
            type="number"
            value={formData.sortOrder}
            onChange={(e) => setFormData({ ...formData, sortOrder: Number(e.target.value) })}
          />

          <Textarea
            label="Deskripsi Kategori (Opsional)"
            rows={2}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />

          <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit" variant="gold" size="sm" isLoading={isSubmitting} className="font-bold text-xs uppercase">
              Simpan
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
