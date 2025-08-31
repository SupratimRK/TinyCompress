export enum CompressionStatus {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error'
}

export interface CompressedImage {
  url: string;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
}

export interface ImageFile {
  id: string;
  file: File;
  preview: string;
}

export interface CompressionResult {
  original: ImageFile;
  compressed: CompressedImage;
  status: CompressionStatus;
  error?: string;
}

export type SizeOption = {
  id: string;
  label: string;
  value: number; // size in KB
};

export type ResizeMethod = 'scale' | 'fit' | 'cover' | 'thumb';