import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export const rfqSchema = z.object({
  customerName: z.string().min(3, "Nama lengkap minimal 3 karakter"),
  companyName: z.string().min(2, "Nama perusahaan/institusi minimal 2 karakter"),
  email: z.string().email("Format email tidak valid"),
  whatsapp: z.string().min(8, "Nomor WhatsApp minimal 8 digit"),
  requestType: z.enum(["BARANG", "JASA", "KEDUANYA"], {
    errorMap: () => ({ message: "Pilih jenis permintaan yang valid" }),
  }),
  targetItem: z.string().min(3, "Nama produk atau lingkup jasa harus diisi"),
  quantity: z.string().min(1, "Jumlah atau volume kebutuhan harus diisi"),
  specifications: z.string().min(10, "Spesifikasi kebutuhan minimal 10 karakter"),
  deliveryLocation: z.string().min(3, "Lokasi pengiriman/pekerjaan harus diisi"),
  targetDate: z.string().optional().nullable(),
  attachmentUrl: z.string().optional().nullable(),
  attachmentName: z.string().optional().nullable(),
});

export const contactSchema = z.object({
  name: z.string().min(3, "Nama lengkap minimal 3 karakter"),
  company: z.string().optional().nullable(),
  email: z.string().email("Format email tidak valid"),
  whatsapp: z.string().min(8, "Nomor WhatsApp minimal 8 digit"),
  subject: z.string().min(3, "Subjek pesan minimal 3 karakter"),
  message: z.string().min(10, "Pesan minimal 10 karakter"),
});

export const productSchema = z.object({
  title: z.string().min(3, "Nama produk minimal 3 karakter"),
  sku: z.string().min(2, "SKU produk minimal 2 karakter"),
  brand: z.string().optional().nullable(),
  categoryId: z.string().min(1, "Kategori produk harus dipilih"),
  shortDesc: z.string().min(5, "Deskripsi singkat minimal 5 karakter"),
  description: z.string().min(10, "Deskripsi lengkap minimal 10 karakter"),
  specifications: z.string().min(2, "Spesifikasi produk harus diisi"),
  price: z.number().nullable().optional(),
  showPrice: z.boolean().default(false),
  availability: z.enum(["READY_STOCK", "INDENT", "PRE_ORDER"]),
  isFeatured: z.boolean().default(false),
  isPublished: z.boolean().default(true),
  images: z.string().min(2, "Minimal 1 foto produk harus disertakan"),
});

export const serviceSchema = z.object({
  title: z.string().min(3, "Nama layanan minimal 3 karakter"),
  categoryId: z.string().min(1, "Kategori layanan harus dipilih"),
  shortDesc: z.string().min(5, "Deskripsi singkat minimal 5 karakter"),
  description: z.string().min(10, "Deskripsi lengkap minimal 10 karakter"),
  icon: z.string().optional().nullable(),
  scopeOfWork: z.string().min(2, "Ruang lingkup pekerjaan harus diisi"),
  processSteps: z.string().min(2, "Alur proses pengerjaan harus diisi"),
  advantages: z.string().min(2, "Keunggulan layanan harus diisi"),
  isFeatured: z.boolean().default(false),
  isPublished: z.boolean().default(true),
  images: z.string().min(2, "Minimal 1 gambar layanan harus disertakan"),
});

export const portfolioSchema = z.object({
  title: z.string().min(3, "Judul proyek minimal 3 karakter"),
  categoryId: z.string().min(1, "Kategori proyek harus dipilih"),
  clientName: z.string().min(2, "Nama klien harus diisi"),
  location: z.string().min(2, "Lokasi pengerjaan harus diisi"),
  completionYear: z.number().min(2000).max(2050),
  shortDesc: z.string().min(5, "Ringkasan proyek minimal 5 karakter"),
  description: z.string().min(10, "Deskripsi lengkap minimal 10 karakter"),
  images: z.string().min(2, "Minimal 1 foto dokumentasi proyek harus disertakan"),
  isFeatured: z.boolean().default(false),
  isPublished: z.boolean().default(true),
});

export const articleSchema = z.object({
  title: z.string().min(5, "Judul artikel minimal 5 karakter"),
  categoryId: z.string().min(1, "Kategori artikel harus dipilih"),
  author: z.string().min(2, "Penulis harus diisi"),
  thumbnail: z.string().min(5, "Thumbnail artikel harus disertakan"),
  excerpt: z.string().min(10, "Ringkasan artikel minimal 10 karakter"),
  content: z.string().min(20, "Konten artikel minimal 20 karakter"),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
  isPublished: z.boolean().default(true),
});

export const categorySchema = z.object({
  name: z.string().min(2, "Nama kategori minimal 2 karakter"),
  type: z.enum(["PRODUCT", "SERVICE", "PORTFOLIO", "ARTICLE"]),
  description: z.string().optional().nullable(),
  icon: z.string().optional().nullable(),
  sortOrder: z.number().default(0),
});

