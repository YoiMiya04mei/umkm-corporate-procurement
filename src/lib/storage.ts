import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

export interface StorageResult {
  url: string;
  originalName: string;
  size: number;
  mimeType: string;
}

const ALLOWED_MIME_TYPES = [
  // Images
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
  // Documents
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
  "application/zip",
  "application/x-zip-compressed",
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export interface StorageProvider {
  uploadFile(file: File): Promise<StorageResult>;
  deleteFile(fileUrl: string): Promise<boolean>;
}

export class LocalStorageProvider implements StorageProvider {
  private uploadDir = path.join(process.cwd(), "public", "uploads");

  private async ensureDir() {
    try {
      await fs.access(this.uploadDir);
    } catch {
      await fs.mkdir(this.uploadDir, { recursive: true });
    }
  }

  async uploadFile(file: File): Promise<StorageResult> {
    if (file.size > MAX_FILE_SIZE) {
      throw new Error("Ukuran file melebihi batas maksimum 10MB");
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      throw new Error(`Format file (${file.type}) tidak diizinkan. Gunakan PDF, DOCX, XLSX, ZIP, atau Gambar (JPG, PNG, WebP)`);
    }

    await this.ensureDir();

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = path.extname(file.name) || `.${file.type.split("/")[1]}`;
    const randomHex = crypto.randomBytes(8).toString("hex");
    const safeName = `${Date.now()}-${randomHex}${ext.toLowerCase()}`;
    const filePath = path.join(this.uploadDir, safeName);

    await fs.writeFile(filePath, buffer);

    return {
      url: `/uploads/${safeName}`,
      originalName: file.name,
      size: file.size,
      mimeType: file.type,
    };
  }

  async deleteFile(fileUrl: string): Promise<boolean> {
    try {
      if (!fileUrl.startsWith("/uploads/")) return false;
      const fileName = path.basename(fileUrl);
      const filePath = path.join(this.uploadDir, fileName);
      await fs.unlink(filePath);
      return true;
    } catch {
      return false;
    }
  }
}

export const storage = new LocalStorageProvider();
