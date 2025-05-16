import axios from 'axios';

// Types
export interface CompressedImage {
  url: string;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
}

export interface CompressionStats {
  compressionsThisMonth: number;
  remainingCompression: number;
}

// Size presets in KB
export const SIZE_PRESETS = {
  TINY: 20,
  SMALL: 50,
  MEDIUM: 100,
  REGULAR: 150,
  LARGE: 250,
  EXTRA_LARGE: 500,
};

// Function to get base URL for the Netlify functions
const getApiUrl = () => {
  // In development, use the local Netlify dev server
  if (process.env.NODE_ENV === 'development') {
    return '/.netlify/functions';
  }
  // In production, use the deployed Netlify functions
  return '/api';
};

class TinyPngService {
  private compressionStats: CompressionStats | null = null;

  constructor() {
    // No need to store API key here, it's managed by environment variable on the server
  }
  /**
   * Validate the server connection
   * @returns An object with a boolean success flag and an optional error message
   */
  async validateServerConnection(): Promise<{success: boolean, error?: string}> {
    try {
      // Attempt a small compression to validate the connection
      const testImage = await this.createDummyImage();
      await this.compressImage(testImage);
      return { success: true };
    } catch (error: any) {
      console.error('Server connection error:', error);
      
      // Extract meaningful error message
      let errorMessage = 'Unable to connect to compression service';
      
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return { 
        success: false, 
        error: errorMessage
      };
    }
  }

  /**
   * Create a small dummy image for API validation
   */
  private async createDummyImage(): Promise<File> {
    // Create a 1x1 transparent pixel
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = 'rgba(0,0,0,0)';
      ctx.fillRect(0, 0, 1, 1);
    }
    
    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((b) => resolve(b!), 'image/png');
    });
    
    return new File([blob], 'validation.png', { type: 'image/png' });
  }

  /**
   * Compress an image using TinyPNG API via Netlify function
   */
  async compressImage(file: File): Promise<CompressedImage> {
    try {
      const originalSize = file.size;
      
      // Convert file to base64
      const base64Data = await this.fileToBase64(file);
      
      // Call the Netlify function
      const response = await axios.post(`${getApiUrl()}/compress`, {
        imageData: base64Data,
      });
      
      const { 
        compressedImage, 
        compressedSize, 
        compressionRatio,
        compressionsThisMonth,
        remainingCompression
      } = response.data;
      
      // Update compression stats
      this.compressionStats = {
        compressionsThisMonth,
        remainingCompression
      };
      
      // Create a blob URL from the base64 data
      const blob = await fetch(compressedImage).then(res => res.blob());
      const url = URL.createObjectURL(blob);
      
      return {
        url,
        originalSize,
        compressedSize,
        compressionRatio,
      };
    } catch (error: any) {
      console.error('Compression error:', error);
      
      if (error.response?.data?.error) {
        throw new Error(`TinyPNG API error: ${error.response.data.error}`);
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
      
      // Call the Netlify function with target size
      const response = await axios.post(`${getApiUrl()}/compress`, {
        imageData: base64Data,
        targetSizeKB
      });
      
      const { 
        compressedImage, 
        compressedSize, 
        compressionRatio,
        compressionsThisMonth,
        remainingCompression
      } = response.data;
      
      // Update compression stats
      this.compressionStats = {
        compressionsThisMonth,
        remainingCompression
      };
      
      // Create a blob URL from the base64 data
      const blob = await fetch(compressedImage).then(res => res.blob());
      const url = URL.createObjectURL(blob);
      
      return {
        url,
        originalSize,
        compressedSize,
        compressionRatio,
      };
    } catch (error: any) {
      console.error('Resize error:', error);
      
      if (error.response?.data?.error) {
        throw new Error(`TinyPNG API error: ${error.response.data.error}`);
      }
      
      throw new Error('Failed to resize image');
    }
  }
  
  /**
   * Get compression stats
   */
  getCompressionStats(): CompressionStats | null {
    return this.compressionStats;
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

export default TinyPngService;
