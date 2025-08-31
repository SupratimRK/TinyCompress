'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import FileUploader from '@/components/FileUploader';
import { useImageFiles } from '@/hooks/useImageFiles';
import ImageCompressionService from '@/services/imageCompressionService';
import { SizeOption, CompressionResult, CompressionStatus } from '@/types';

const sizeOptions: SizeOption[] = [
  { id: 'tiny', label: '20 KB', value: 20 },
  { id: 'small', label: '50 KB', value: 50 },
  { id: 'medium', label: '100 KB', value: 100 },
  { id: 'regular', label: '150 KB', value: 150 },
  { id: 'large', label: '250 KB', value: 250 },
  { id: 'xlarge', label: '500 KB', value: 500 },
];

export default function Home() {
  const { images, addImages, removeImage, clearImages } = useImageFiles();
  const [selectedSizeOption, setSelectedSizeOption] = useState<SizeOption>(sizeOptions[3]);
  const [compressionResults, setCompressionResults] = useState<CompressionResult[]>([]);
  const [isCompressing, setIsCompressing] = useState(false);
  const [service] = useState(() => new ImageCompressionService());

  const handleFileDrop = (files: File[]) => {
    if (files.length === 0) {
      clearImages();
      setCompressionResults([]);
      return;
    }
    
    clearImages();
    setCompressionResults([]);
    addImages(files);
  };

  const handleCompressImages = async () => {
    if (!selectedSizeOption) return;
    
    setIsCompressing(true);
    const updatedResults = [...compressionResults];
    
    for (const image of images) {
      const existingResultIndex = updatedResults.findIndex(
        (r) => r.original.id === image.id && r.status === CompressionStatus.SUCCESS
      );
      
      if (existingResultIndex !== -1) continue;
      
      const resultIndex = updatedResults.findIndex(
        (r) => r.original.id === image.id
      );
      
      const loadingResult: CompressionResult = {
        original: image,
        compressed: {
          url: '',
          originalSize: image.file.size,
          compressedSize: 0,
          compressionRatio: 0,
        },
        status: CompressionStatus.LOADING,
      };
      
      if (resultIndex !== -1) {
        updatedResults[resultIndex] = loadingResult;
      } else {
        updatedResults.push(loadingResult);
      }
      
      setCompressionResults([...updatedResults]);
      
      try {
        const result = await service.resizeToFileSize(
          image.file,
          selectedSizeOption.value
        );
        
        const successResult: CompressionResult = {
          original: image,
          compressed: result,
          status: CompressionStatus.SUCCESS,
        };
        
        const finalIndex = updatedResults.findIndex(
          (r) => r.original.id === image.id
        );
        
        if (finalIndex !== -1) {
          updatedResults[finalIndex] = successResult;
        }
      } catch (error) {
        const errorResult: CompressionResult = {
          original: image,
          compressed: {
            url: '',
            originalSize: image.file.size,
            compressedSize: 0,
            compressionRatio: 0,
          },
          status: CompressionStatus.ERROR,
          error: error instanceof Error ? error.message : 'Unknown error',
        };
        
        const finalIndex = updatedResults.findIndex(
          (r) => r.original.id === image.id
        );
        
        if (finalIndex !== -1) {
          updatedResults[finalIndex] = errorResult;
        }
      }
      
      setCompressionResults([...updatedResults]);
    }
    
    setIsCompressing(false);
  };

  const handleDownloadAll = () => {
    compressionResults
      .filter(result => result.status === CompressionStatus.SUCCESS)
      .forEach(result => {
        const link = document.createElement('a');
        link.href = result.compressed.url;
        link.download = `compressed-${result.original.file.name}`;
        link.click();
      });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const mainPreviewImage = images[0];
  const mainPreviewResult = compressionResults.find(
    (result) => result.original.id === mainPreviewImage?.id
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.header 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            TinyCompress
          </h1>
          <p className="text-lg text-gray-600">
            Compress images with Sharp - Local processing, no external dependencies
          </p>
        </motion.header>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          {images.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <FileUploader 
                onDrop={handleFileDrop} 
                uploadedFiles={images}
              />
            </motion.div>
          ) : (
            <motion.div
              className="w-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {/* Image Preview Area */}
              <div className="p-6 relative">
                {mainPreviewImage && (
                  <div className="aspect-auto max-h-[400px] flex justify-center items-center">
                    <img 
                      src={mainPreviewResult?.status === CompressionStatus.SUCCESS
                        ? mainPreviewResult.compressed.url 
                        : mainPreviewImage.preview}
                      alt="Preview"
                      className="max-h-[400px] object-contain rounded-lg"
                    />
                  </div>
                )}
                
                {/* Compression Options */}
                <div className="mt-6 border-t pt-6">
                  <h3 className="text-lg font-medium mb-4">Compression Settings</h3>
                  
                  {/* Size Options */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Target Size
                    </label>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                      {sizeOptions.map((option) => (
                        <button
                          key={option.id}
                          onClick={() => setSelectedSizeOption(option)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            selectedSizeOption.id === option.id
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Compress Button */}
                  <div className="flex justify-center">
                    <motion.button
                      onClick={handleCompressImages}
                      disabled={isCompressing}
                      className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-8 py-3 rounded-lg font-medium transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {isCompressing ? 'Compressing...' : 'Compress Image'}
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Results */}
              {compressionResults.length > 0 && (
                <motion.div 
                  className="bg-gray-50 p-6 border-t"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Compression Results</h3>
                    <motion.button
                      onClick={handleDownloadAll}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Download All
                    </motion.button>
                  </div>
                  
                  {compressionResults.map((result) => (
                    <div key={result.original.id} className="bg-white rounded-lg p-4 mb-3 last:mb-0">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-800">{result.original.file.name}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>Original: {formatFileSize(result.original.file.size)}</span>
                            {result.status === CompressionStatus.SUCCESS && (
                              <>
                                <span>Compressed: {formatFileSize(result.compressed.compressedSize)}</span>
                                <span className="text-green-600 font-medium">
                                  {Math.round(result.compressed.compressionRatio)}% smaller
                                </span>
                              </>
                            )}
                            {result.status === CompressionStatus.ERROR && (
                              <span className="text-red-600">Error: {result.error}</span>
                            )}
                            {result.status === CompressionStatus.LOADING && (
                              <span className="text-blue-600">Processing...</span>
                            )}
                          </div>
                        </div>
                        
                        {result.status === CompressionStatus.SUCCESS && (
                          <motion.button
                            onClick={() => {
                              const link = document.createElement('a');
                              link.href = result.compressed.url;
                              link.download = `compressed-${result.original.file.name}`;
                              link.click();
                            }}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Download
                          </motion.button>
                        )}
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
