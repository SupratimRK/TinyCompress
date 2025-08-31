import { CompressedImage } from '@/types';

export const SIZE_PRESETS = [
  { id: '20kb', label: '20KB', value: 20 },
  { id: '50kb', label: '50KB', value: 50 },
  { id: '100kb', label: '100KB', value: 100 },
  { id: '150kb', label: '150KB', value: 150 },
  { id: '250kb', label: '250KB', value: 250 },
  { id: '500kb', label: '500KB', value: 500 },
];

class ImageCompressionService {
  /**
   * Compress an image using Sharp via Next.js API route
   */
  async compressImage(file: File): Promise<CompressedImage> {
    try {
      const originalSize = file.size;
      
      // Convert file to base64
      const base64Data = await this.fileToBase64(file);
      
      // Call the Next.js API route
      const response = await fetch('/api/compress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageData: base64Data,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to compress image');
      }
      
      const { 
        compressedImage, 
        compressedSize, 
        compressionRatio,
      } = await response.json();
      
      // Create a blob URL from the base64 data
      const blob = await fetch(compressedImage).then(res => res.blob());
      const url = URL.createObjectURL(blob);
      
      return {
        url,
        originalSize,
        compressedSize,
        compressionRatio,
      };
    } catch (error: unknown) {
      console.error('Compression error:', error);
      
      if (error instanceof Error && error.message) {
        throw new Error(`Image compression failed: ${error.message}`);
      }
      
      throw new Error('Failed to compress image');
    }
  }

  /**
   * Resize image to fit within a specific file size (in KB)
   */
  async resizeToFileSize(file: File, targetSizeKB: number): Promise<CompressedImage> {
    try {
      const originalSize = file.size;
      
      // Convert file to base64
      const base64Data = await this.fileToBase64(file);
      
      // Call the Next.js API route with target size
      const response = await fetch('/api/compress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageData: base64Data,
          targetSizeKB
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to compress image');
      }
      
      const { 
        compressedImage, 
        compressedSize, 
        compressionRatio,
      } = await response.json();
      
      // Create a blob URL from the base64 data
      const blob = await fetch(compressedImage).then(res => res.blob());
      const url = URL.createObjectURL(blob);
      
      return {
        url,
        originalSize,
        compressedSize,
        compressionRatio,
      };
    } catch (error: unknown) {
      console.error('Resize error:', error);
      
      if (error instanceof Error && error.message) {
        throw new Error(`Image resize failed: ${error.message}`);
      }
      
      throw new Error('Failed to resize image');
    }
  }

  /**
   * Helper method to convert File to base64
   */
  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }
}

export default ImageCompressionService;