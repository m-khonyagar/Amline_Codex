import { LocalStorageDriver } from "@/lib/storage/local-driver";
import { S3CompatibleDriver } from "@/lib/storage/s3-driver";
import type { StorageDriver } from "@/lib/storage/types";

export function getStorageDriver(): StorageDriver {
  const driver = process.env.STORAGE_DRIVER ?? "local";
  return driver === "s3" ? new S3CompatibleDriver() : new LocalStorageDriver();
}
