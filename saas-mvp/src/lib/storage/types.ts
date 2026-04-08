export type UploadResult = {
  fileUrl: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
};

export interface StorageDriver {
  upload(file: File): Promise<UploadResult>;
}
