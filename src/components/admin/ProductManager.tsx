"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Plus, Search, Edit2, Trash2, Package, Upload, X, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { formatRupiah, safeJsonParse } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
}

interface Product {
  id: string;
  title: string;
  slug: string;
  sku: string;
  brand: string | null;
  categoryId: string;
  category: Category;
  shortDesc: string;
  description: string;
  specifications: string;
  price: number | null;
  showPrice: boolean;
  availability: string;
  isFeatured: boolean;
  isPublished: boolean;
  images: string;
  createdAt: string;
}

interface ProductManagerProps {
  initialProducts: Product[];
  categories: Category[];
}

export function ProductManager({ initialProducts, categories }: ProductManagerProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    sku: "",
    brand: "",
    categoryId: categories[0]?.id || "",
    shortDesc: "",
    description: "",
    price: "",
    showPrice: false,
    availability: "READY_STOCK",
    isFeatured: false,
    isPublished: true,
    images: "[]",
  });

  const [specsList, setSpecsList] = useState<{ key: string; value: string }[]>([
    { key: "Kapasitas / Ukuran", value: "" },
    { key: "Standar Uji / Mutu", value: "" },
  ]);

  const [imageUrlInput, setImageUrlInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const filteredProducts = products.filter((p) => {
    const matchSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      (p.brand && p.brand.toLowerCase().includes(search.toLowerCase()));
    const matchCat = selectedCategory ? p.categoryId === selectedCategory : true;
    return matchSearch && matchCat;
  });

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      title: "",
      sku: `SKU-${Date.now().toString().slice(-6)}`,
      brand: "",
      categoryId: categories[0]?.id || "",
      shortDesc: "",
      description: "",
      price: "",
      showPrice: false,
      availability: "READY_STOCK",
      isFeatured: false,
      isPublished: true,
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
      ]),
    });
    setSpecsList([
      { key: "Spesifikasi Utama", value: "" },
      { key: "Garansi", value: "1 Tahun Resmi" },
    ]);
    setErrorMsg("");
    setIsModalOpen(true);
  };

  const openEditModal = (prod: Product) => {
    setEditingProduct(prod);
    setFormData({
      title: prod.title,
      sku: prod.sku,
      brand: prod.brand || "",
      categoryId: prod.categoryId,
      shortDesc: prod.shortDesc,
      description: prod.description,
      price: prod.price !== null ? String(prod.price) : "",
      showPrice: prod.showPrice,
      availability: prod.availability,
      isFeatured: prod.isFeatured,
      isPublished: prod.isPublished,
      images: prod.images,
    });
    const parsedSpecs = safeJsonParse<{ key: string; value: string }[]>(prod.specifications, []);
    setSpecsList(parsedSpecs.length > 0 ? parsedSpecs : [{ key: "Spesifikasi", value: "" }]);
    setErrorMsg("");
    setIsModalOpen(true);
  };

  const handleAddSpec = () => {
    setSpecsList([...specsList, { key: "", value: "" }]);
  };

  const handleRemoveSpec = (index: number) => {
    setSpecsList(specsList.filter((_, i) => i !== index));
  };

  const handleSpecChange = (index: number, field: "key" | "value", val: string) => {
    const updated = [...specsList];
    updated[index][field] = val;
    setSpecsList(updated);
  };

  const handleAddImage = () => {
    if (!imageUrlInput.trim()) return;
    const current = safeJsonParse<string[]>(formData.images, []);
    const updated = [...current, imageUrlInput.trim()];
    setFormData({ ...formData, images: JSON.stringify(updated) });
    setImageUrlInput("");
  };

  const handleRemoveImage = (index: number) => {
    const current = safeJsonParse<string[]>(formData.images, []);
    const updated = current.filter((_, i) => i !== index);
    setFormData({ ...formData, images: JSON.stringify(updated) });
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const validSpecs = specsList.filter((s) => s.key.trim() && s.value.trim());

      const payload = {
        title: formData.title,
        sku: formData.sku,
        brand: formData.brand || null,
        categoryId: formData.categoryId,
        shortDesc: formData.shortDesc,
        description: formData.description,
        specifications: JSON.stringify(validSpecs),
        price: formData.price ? parseFloat(formData.price) : null,
        showPrice: formData.showPrice,
        availability: formData.availability,
        isFeatured: formData.isFeatured,
        isPublished: formData.isPublished,
        images: formData.images,
      };

      const url = "/api/admin/products";
      const method = editingProduct ? "PUT" : "POST";
      const body = editingProduct ? { id: editingProduct.id, ...payload } : payload;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Gagal menyimpan produk");
      }

      // Refresh list
      const updatedList = await fetch("/api/admin/products").then((r) => r.json());
      if (updatedList.success) {
        setProducts(updatedList.data);
      }

      setIsModalOpen(false);
    } catch (err: any) {
      setErrorMsg(err.message || "Terjadi kesalahan saat menyimpan produk");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus produk ini dari katalog?")) return;
    setIsDeleting(id);

    try {
      const res = await fetch(`/api/admin/products?id=${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Gagal menghapus produk");
      }

      setProducts(products.filter((p) => p.id !== id));
    } catch (err: any) {
      alert(err.message || "Gagal menghapus");
    } finally {
      setIsDeleting(null);
    }
  };

  const currentImages = safeJsonParse<string[]>(formData.images, []);

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-corporate-navy">Katalog Produk Pengadaan</h1>
          <p className="text-xs text-gray-500">Kelola inventaris barang, spesifikasi teknis, harga, dan ketersediaan stok</p>
        </div>
        <Button variant="gold" size="sm" onClick={openCreateModal} className="font-bold text-xs uppercase tracking-wider">
          <Plus className="w-4 h-4 mr-1.5" />
          Tambah Produk Baru
        </Button>
      </div>

      {/* Filter and Search */}
      <Card className="p-4 flex flex-col sm:flex-row gap-3 justify-between items-center">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Cari nama, SKU, atau brand..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-corporate-blue/20"
          />
        </div>

        <div className="w-full sm:w-auto flex items-center gap-2">
          <span className="text-xs text-gray-500 font-semibold">Kategori:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs py-2 px-3 rounded-lg border border-gray-200 bg-white focus:outline-none"
          >
            <option value="">Semua Kategori</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {/* Products Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-corporate-light-gray text-corporate-navy font-semibold uppercase text-[10px] tracking-wider border-b border-gray-200">
              <tr>
                <th className="py-3 px-4">Info Produk</th>
                <th className="py-3 px-4">Kategori & Brand</th>
                <th className="py-3 px-4">Ketersediaan</th>
                <th className="py-3 px-4">Harga</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-400">
                    Tidak ada produk yang sesuai dengan pencarian.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((prod) => {
                  const imgs = safeJsonParse<string[]>(prod.images, []);
                  const thumb = imgs[0] || "https://placehold.co/80";

                  return (
                    <tr key={prod.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-lg bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
                            <Image src={thumb} alt={prod.title} fill className="object-cover" />
                          </div>
                          <div>
                            <p className="font-bold text-corporate-navy line-clamp-1">{prod.title}</p>
                            <p className="font-mono text-[10px] text-gray-400">SKU: {prod.sku}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-medium text-gray-800">{prod.category?.name || "-"}</p>
                        <p className="text-[11px] text-corporate-blue font-semibold">{prod.brand || "-"}</p>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={prod.availability === "READY_STOCK" ? "success" : "warning"} size="sm">
                          {prod.availability}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        {prod.showPrice ? (
                          <p className="font-bold text-corporate-navy">{formatRupiah(prod.price)}</p>
                        ) : (
                          <span className="text-gray-400 italic">Minta Penawaran (RFQ)</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {prod.isPublished ? (
                          <span className="text-emerald-600 font-semibold flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> Terbit
                          </span>
                        ) : (
                          <span className="text-gray-400 font-medium">Draft</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditModal(prod)}
                            className="p-1.5 h-auto text-corporate-blue"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            disabled={isDeleting === prod.id}
                            onClick={() => handleDeleteProduct(prod.id)}
                            className="p-1.5 h-auto"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? "Edit Informasi Produk" : "Tambah Produk Pengadaan Baru"}
        description="Lengkapi detail produk, spesifikasi teknis, harga, dan foto untuk katalog website."
        maxWidth="3xl"
      >
        <form onSubmit={handleSaveProduct} className="space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Nama Produk"
              required
              placeholder="Contoh: Genset Silent Diesel 50 kVA"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
            <Input
              label="SKU Produk (Kode Unik)"
              required
              placeholder="Contoh: GEN-PKN-050"
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Kategori Produk"
              required
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              options={categories.map((c) => ({ value: c.id, label: c.name }))}
            />
            <Input
              label="Brand / Merk"
              placeholder="Contoh: Perkins / Stamford"
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
            />
          </div>

          <Textarea
            label="Deskripsi Singkat (Ringkasan Katalog)"
            required
            rows={2}
            placeholder="Ringkasan 1-2 kalimat untuk preview card..."
            value={formData.shortDesc}
            onChange={(e) => setFormData({ ...formData, shortDesc: e.target.value })}
          />

          <Textarea
            label="Deskripsi Lengkap & Aplikasi"
            required
            rows={4}
            placeholder="Penjelasan detail mengenai penggunaan, material, keandalan, dan garansi..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />

          {/* Pricing & Availability */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-corporate-light-gray border border-gray-200">
            <Input
              label="Harga Satuan (Rp)"
              type="number"
              placeholder="Kosongkan jika RFQ"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            />
            <Select
              label="Ketersediaan Stok"
              value={formData.availability}
              onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
              options={[
                { value: "READY_STOCK", label: "Ready Stock" },
                { value: "INDENT", label: "Indent" },
                { value: "PRE_ORDER", label: "Pre Order" },
              ]}
            />
            <div className="space-y-1.5 flex flex-col justify-center pt-3">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-corporate-navy">
                <input
                  type="checkbox"
                  checked={formData.showPrice}
                  onChange={(e) => setFormData({ ...formData, showPrice: e.target.checked })}
                  className="rounded text-corporate-blue focus:ring-corporate-blue"
                />
                <span>Tampilkan Harga ke Publik</span>
              </label>
              <p className="text-[10px] text-gray-500">Jika unchecked, tampil tombol RFQ Penawaran.</p>
            </div>
          </div>

          {/* Dynamic Specifications Builder */}
          <div className="space-y-2 border p-4 rounded-xl border-gray-200">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase tracking-wider text-corporate-navy">
                Spesifikasi Teknis (Tabel Key - Value)
              </label>
              <Button type="button" variant="outline" size="sm" onClick={handleAddSpec} className="text-xs py-1 px-2.5">
                + Tambah Baris
              </Button>
            </div>

            <div className="space-y-2">
              {specsList.map((spec, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <input
                    type="text"
                    placeholder="Parameter (misal: Tegangan)"
                    value={spec.key}
                    onChange={(e) => handleSpecChange(idx, "key", e.target.value)}
                    className="w-1/3 text-xs p-2 rounded-lg border border-gray-200 focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Nilai (misal: 380V, 3 Phase, 50Hz)"
                    value={spec.value}
                    onChange={(e) => handleSpecChange(idx, "value", e.target.value)}
                    className="flex-1 text-xs p-2 rounded-lg border border-gray-200 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveSpec(idx)}
                    className="p-1.5 text-rose-500 hover:bg-rose-50 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Product Image URL List */}
          <div className="space-y-2 border p-4 rounded-xl border-gray-200">
            <label className="text-xs font-bold uppercase tracking-wider text-corporate-navy">
              Foto Produk (URL Gambar)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Masukkan URL foto (https://...)"
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                className="flex-1 text-xs p-2 rounded-lg border border-gray-200 focus:outline-none"
              />
              <Button type="button" variant="outline" size="sm" onClick={handleAddImage} className="text-xs">
                Tambahkan
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {currentImages.map((img, idx) => (
                <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200 group">
                  <Image src={img} alt="" fill className="object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-1 right-1 bg-rose-600 text-white rounded p-1 opacity-80 group-hover:opacity-100"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Visibility Options */}
          <div className="flex gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-corporate-navy">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="rounded text-corporate-gold"
              />
              <span>Tampilkan di Beranda (Featured)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-corporate-navy">
              <input
                type="checkbox"
                checked={formData.isPublished}
                onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                className="rounded text-emerald-600"
              />
              <span>Publikasikan ke Website</span>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit" variant="gold" size="sm" isLoading={isSubmitting} className="font-bold text-xs uppercase">
              Simpan Produk
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

