import { mkdir, writeFile } from "fs/promises";
import path from "path";

import type { StorageDriver, UploadResult } from "@/lib/storage/types";

export class LocalStorageDriver implements StorageDriver {
  async upload(file: File): Promise<UploadResult> {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    const safeName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
    const fullPath = path.join(uploadDir, safeName);
    await writeFile(fullPath, buffer);

    return {
      fileUrl: `/uploads/${safeName}`,
      fileName: file.name,
      mimeType: file.type || "application/octet-stream",
      sizeBytes: file.size
    };
  }
}
