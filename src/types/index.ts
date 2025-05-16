import { CompressedImage } from "../services/tinypngService";
import { ImageFile } from "../hooks/useImageFiles";

export enum CompressionStatus {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error'
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
