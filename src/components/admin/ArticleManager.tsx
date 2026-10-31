"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Plus, Edit2, Trash2, FileText, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";

interface Category {
  id: string;
  name: string;
}

interface Article {
  id: string;
  title: string;
  slug: string;
  categoryId: string;
  category: Category;
  author: string;
  thumbnail: string;
  excerpt: string;
  content: string;
  seoTitle: string | null;
  seoDescription: string | null;
  isPublished: boolean;
  publishedAt: string;
}

interface ArticleManagerProps {
  initialArticles: Article[];
  categories: Category[];
}

export function ArticleManager({ initialArticles, categories }: ArticleManagerProps) {
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    categoryId: categories[0]?.id || "",
    author: "Redaksi Mitra Karya",
    thumbnail: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80",
    excerpt: "",
    content: "",
    seoTitle: "",
    seoDescription: "",
    isPublished: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const openCreateModal = () => {
    setEditingArticle(null);
    setFormData({
      title: "",
      categoryId: categories[0]?.id || "",
      author: "Redaksi Mitra Karya",
      thumbnail: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80",
      excerpt: "",
      content: "",
      seoTitle: "",
      seoDescription: "",
      isPublished: true,
    });
    setErrorMsg("");
    setIsModalOpen(true);
  };

  const openEditModal = (art: Article) => {
    setEditingArticle(art);
    setFormData({
      title: art.title,
      categoryId: art.categoryId,
      author: art.author,
      thumbnail: art.thumbnail,
      excerpt: art.excerpt,
      content: art.content,
      seoTitle: art.seoTitle || "",
      seoDescription: art.seoDescription || "",
      isPublished: art.isPublished,
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
        author: formData.author,
        thumbnail: formData.thumbnail,
        excerpt: formData.excerpt,
        content: formData.content,
        seoTitle: formData.seoTitle || formData.title,
        seoDescription: formData.seoDescription || formData.excerpt,
        isPublished: formData.isPublished,
      };

      const url = "/api/admin/articles";
      const method = editingArticle ? "PUT" : "POST";
      const body = editingArticle ? { id: editingArticle.id, ...payload } : payload;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || "Gagal menyimpan artikel");

      const updated = await fetch("/api/admin/articles").then((r) => r.json());
      if (updated.success) setArticles(updated.data);

      setIsModalOpen(false);
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus artikel ini?")) return;
    try {
      const res = await fetch(`/api/admin/articles?id=${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message);
      setArticles(articles.filter((a) => a.id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-corporate-navy">Manajemen Artikel & Wawasan</h1>
          <p className="text-xs text-gray-500">Publikasi berita, studi kasus pengadaan, dan artikel regulasi</p>
        </div>
        <Button variant="gold" size="sm" onClick={openCreateModal} className="font-bold text-xs uppercase tracking-wider">
          <Plus className="w-4 h-4 mr-1.5" />
          Tulis Artikel Baru
        </Button>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-corporate-light-gray text-corporate-navy font-semibold uppercase text-[10px] tracking-wider border-b border-gray-200">
              <tr>
                <th className="py-3 px-4">Judul Artikel</th>
                <th className="py-3 px-4">Kategori & Penulis</th>
                <th className="py-3 px-4">Tanggal Rilis</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {articles.map((art) => (
                <tr key={art.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 font-bold text-corporate-navy max-w-sm">{art.title}</td>
                  <td className="py-3 px-4">
                    <p className="font-semibold text-corporate-blue">{art.category.name}</p>
                    <p className="text-[11px] text-gray-500">Oleh: {art.author}</p>
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {new Date(art.publishedAt).toLocaleDateString("id-ID")}
                  </td>
                  <td className="py-3 px-4">
                    {art.isPublished ? (
                      <span className="text-emerald-600 font-semibold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Terbit
                      </span>
                    ) : (
                      <span className="text-gray-400">Draft</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex justify-end gap-1.5">
                      <Button variant="outline" size="sm" onClick={() => openEditModal(art)} className="p-1.5 h-auto text-corporate-blue">
                        <Edit2 className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => handleDelete(art.id)} className="p-1.5 h-auto">
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
        title={editingArticle ? "Edit Artikel" : "Tulis Artikel Baru"}
        maxWidth="3xl"
      >
        <form onSubmit={handleSave} className="space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <Input
            label="Judul Artikel"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Kategori Artikel"
              required
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              options={categories.map((c) => ({ value: c.id, label: c.name }))}
            />
            <Input
              label="Nama Penulis"
              required
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
            />
          </div>

          <Input
            label="URL Foto Thumbnail"
            required
            value={formData.thumbnail}
            onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
          />

          <Textarea
            label="Ringkasan (Excerpt)"
            required
            rows={2}
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
          />

          <Textarea
            label="Konten Artikel (Mendukung Format HTML/Paragraf)"
            required
            rows={8}
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-gray-50 border border-gray-200">
            <Input
              label="SEO Title (Opsional)"
              value={formData.seoTitle}
              onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
            />
            <Input
              label="SEO Meta Description (Opsional)"
              value={formData.seoDescription}
              onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
            />
          </div>

          <div className="flex gap-4 pt-2">
            <label className="flex items-center gap-2 text-xs font-semibold text-corporate-navy cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isPublished}
                onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
              />
              <span>Publikasikan ke Website</span>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit" variant="gold" size="sm" isLoading={isSubmitting} className="font-bold text-xs uppercase">
              Simpan Artikel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
