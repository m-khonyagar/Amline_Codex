import type { StorageDriver, UploadResult } from "@/lib/storage/types";

export class S3CompatibleDriver implements StorageDriver {
  async upload(_file: File): Promise<UploadResult> {
    throw new Error("S3 driver is not configured in MVP. Set credentials and implement SDK adapter.");
  }
}
