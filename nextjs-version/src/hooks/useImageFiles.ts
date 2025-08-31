import { useState } from 'react';
import { ImageFile } from '@/types';

export function useImageFiles() {
  const [images, setImages] = useState<ImageFile[]>([]);

  const addImages = (files: File[]) => {
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      id: `${file.name}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }));
    
    setImages(prevImages => [...prevImages, ...newImages]);
  };

  const removeImage = (id: string) => {
    setImages(prevImages => {
      const imageToRemove = prevImages.find(img => img.id === id);
      
      // Revoke object URL to prevent memory leaks
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.preview);
      }
      
      return prevImages.filter(img => img.id !== id);
    });
  };

  const clearImages = () => {
    images.forEach(image => {
      URL.revokeObjectURL(image.preview);
    });
    setImages([]);
  };

  return {
    images,
    addImages,
    removeImage,
    clearImages
  };
}