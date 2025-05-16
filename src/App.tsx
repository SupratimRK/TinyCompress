import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { IconInfo, IconHeart, IconImage, IconUpload, IconDownload, IconX } from './react-icons-fix';
import { getRandomTheme, applyTheme } from './utils/theme';
import './App.css';

// Components
import Header from './components/Header';
import FileUploader from './components/FileUploader';
import ImagePreview from './components/ImagePreview';
import CompressionOptions from './components/CompressionOptions';
import CompressionControls from './components/CompressionControls';
import CompressionStats from './components/CompressionStats';
import ConversionParameters from './components/ConversionParameters';
import UploadInstructions from './components/UploadInstructions';
import Footer from './components/Footer';

// Hooks and services
import { useImageFiles } from './hooks/useImageFiles';
import { useToggle } from './hooks/useToggle';
import TinyPngService, { SIZE_PRESETS } from './services/tinypngService';

// Types
import { SizeOption, CompressionResult, CompressionStatus } from './types';

const sizeOptions: SizeOption[] = [
  { id: 'tiny', label: '20 KB', value: SIZE_PRESETS.TINY },
  { id: 'small', label: '50 KB', value: SIZE_PRESETS.SMALL },
  { id: 'medium', label: '100 KB', value: SIZE_PRESETS.MEDIUM },
  { id: 'regular', label: '150 KB', value: SIZE_PRESETS.REGULAR },
  { id: 'large', label: '250 KB', value: SIZE_PRESETS.LARGE },
  { id: 'xlarge', label: '500 KB', value: SIZE_PRESETS.EXTRA_LARGE },
];

function App() {
  // State for service connection
  const [serviceConnected, setServiceConnected] = useState<boolean>(false);
  const [serviceError, setServiceError] = useState<string | null>(null);
  const [service, setService] = useState<TinyPngService | null>(null);
  
  // Reference for FileUploader section
  const fileUploaderRef = useRef<HTMLDivElement>(null);
  
  // State for compression options
  const [selectedSizeOption, setSelectedSizeOption] = useState<SizeOption | null>(
    sizeOptions[3] // Default to 150KB
  );
  
  // State for conversion parameters
  const [selectedFormat, setSelectedFormat] = useState<string>('same');
  const [quality, setQuality] = useState<number>(75);
  
  // State for images
  const { images, addImages, removeImage, clearImages } = useImageFiles();
  const [compressionResults, setCompressionResults] = useState<CompressionResult[]>([]);  const [isCompressing, setIsCompressing] = useState<boolean>(false);
  
  // Initialize theme and TinyPNG service on component mount
  useEffect(() => {
    // Apply random theme
    const selectedTheme = getRandomTheme();
    applyTheme(selectedTheme);
    document.body.classList.add('theme-transition');
    
    const initializeService = async () => {
      try {
        const newService = new TinyPngService();
        setService(newService);
        
        // Test the service connection
        const connectionResult = await newService.validateServerConnection();
        setServiceConnected(connectionResult.success);
        
        if (!connectionResult.success) {
          setServiceError(connectionResult.error || 'Unable to connect to compression service');
        } else {
          setServiceError(null);
        }
      } catch (error) {
        console.error('Error initializing service:', error);
        setServiceConnected(false);
        setServiceError('Unexpected error initializing service');
        setService(null);
      }
    };
    
    initializeService();
  }, []);
    // Handle image upload - now just replaces any existing image
  const handleFileDrop = (files: File[]) => {
    // Clear existing images and results
    clearImages();
    setCompressionResults([]);
    
    // Add the new single image
    addImages(files);
  };
  
  // Handle image removal
  const handleRemoveImage = (id: string) => {
    removeImage(id);
    
    // Remove compression result for this image
    setCompressionResults((prev) => 
      prev.filter((result) => result.original.id !== id)
    );
  };
  
  // Handle compression
  const handleCompressImages = async () => {
    if (!service || !selectedSizeOption || !serviceConnected) return;
    
    setIsCompressing(true);
    
    // Create a copy of the current results
    const updatedResults = [...compressionResults];
    
    // Process each image
    for (const image of images) {
      // Skip if already processed successfully
      const existingResultIndex = updatedResults.findIndex(
        (r) => r.original.id === image.id && r.status === CompressionStatus.SUCCESS
      );
      
      if (existingResultIndex !== -1) continue;
      
      // Update or add result with loading status
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
      
      // Process the image
      try {
        const result = await service.resizeToFileSize(
          image.file,
          selectedSizeOption.value
        );
        
        // Update with success
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
        // Update with error
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
      
      // Update state after each image
      setCompressionResults([...updatedResults]);
    }
    
    setIsCompressing(false);
  };
  
  // Handle clearing and compressing new images
  const handleCompressNewImages = () => {
    // Clear existing images and results
    clearImages();
    setCompressionResults([]);
  };
  
  // Download all compressed images
  const handleDownloadAll = () => {
    compressionResults.forEach((result) => {
      if (result.status === CompressionStatus.SUCCESS) {
        const link = document.createElement('a');
        link.href = result.compressed.url;
        link.download = `compressed-${result.original.file.name}`;
        link.click();
      }
    });
  };
    // Function to scroll to FileUploader section
  const scrollToFileUploader = () => {
    if (fileUploaderRef.current) {
      fileUploaderRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
      });
      
      // Only trigger file input if we don't have images already
      if (images.length === 0) {
        // Use a single timeout to prevent double triggering
        setTimeout(() => {
          const fileInput = document.getElementById('file-input') as HTMLInputElement;
          if (fileInput) {
            fileInput.value = '';
            fileInput.click();
          }
        }, 500);
      }
    }
  };
  
  // Check if any images have been successfully compressed
  const hasCompressedImages = compressionResults.some(
    (result) => result.status === CompressionStatus.SUCCESS
  );
  
  // Get the main image to display in preview area
  const mainPreviewImage = images.length > 0 ? images[0] : null;
  const mainPreviewResult = mainPreviewImage ? compressionResults.find(
    (result) => result.original.id === mainPreviewImage.id
  ) : null;
  
  return (
    <div className="min-h-screen text-dark transition-all">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <Header />
        
        <div className="w-full">
          {/* Image Upload/Preview Area - At the top */}
          <div className="mb-6">
            <div ref={fileUploaderRef}>
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
                    
                    {/* Image Count Overlay */}
                    <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm rounded-full py-1.5 px-3 shadow-sm border border-gray-100">
                      <div className="flex items-center">
                        <IconImage className="text-primary mr-2 w-5 h-5" />
                        <span className="text-sm font-medium">Image Ready</span>
                      </div>
                    </div>
                    {/* Clear Image Button */}
                    <div className="absolute top-4 left-4">
                      <button
                        className="bg-white/80 backdrop-blur-sm rounded-full py-1.5 px-3 shadow-sm border border-gray-100 hover:bg-gray-200 transition-colors"
                        onClick={() => {
                          // Clear existing images
                          clearImages();
                          setCompressionResults([]);
                        }}
                      >
                        <div className="flex items-center">
                          <IconX className="mr-1 w-4 h-4" />
                          <span className="text-sm font-medium">Clear Image</span>
                        </div>
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
          
          {/* Conversion Parameters & Options - Always visible */}
          <motion.div 
            className="mb-6 grid grid-cols-1 lg:grid-cols-2 gap-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="lg:col-span-1">
              <CompressionOptions 
                sizeOptions={sizeOptions}
                selectedSizeOption={selectedSizeOption}
                onSelectOption={setSelectedSizeOption}
                serviceConnected={serviceConnected}
                serviceError={serviceError}
              />
            </div>
            <div className="lg:col-span-1">
              <ConversionParameters
                onFormatChange={setSelectedFormat}
                onQualityChange={setQuality}
              />
            </div>
          </motion.div>            {/* Upload Instructions & Action Controls */}          <UploadInstructions 
            onUploadClick={() => {
              // Use the scroll function to move users to the FileUploader section
              scrollToFileUploader();
            }}
            onCompressClick={handleCompressImages}
            onDownloadClick={handleDownloadAll}
            onClearClick={() => {
              // Clear the images and scroll to upload area
              clearImages();
              setCompressionResults([]);
              
              // Scroll to the file uploader area but don't trigger file picker
              if (fileUploaderRef.current) {
                fileUploaderRef.current.scrollIntoView({ 
                  behavior: 'smooth',
                  block: 'center'
                });
              }
            }}
            isCompressing={isCompressing}
            hasImages={images.length > 0}
            hasCompressedImages={hasCompressedImages}
          />
            {/* Toggle View Button has been removed */}
          
          {images.length > 0 && (
            <>
              {/* Statistics for compressed images */}
              {hasCompressedImages && (
                <motion.div 
                  className="mb-6"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <CompressionStats 
                    results={compressionResults} 
                    onDownloadAll={handleDownloadAll}
                    onCompressNew={handleCompressNewImages} 
                  />
                </motion.div>
              )}

              {/* Image Grid - Thumbnails of all images */}
              <AnimatePresence>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                  {images.map((image) => (
                    <ImagePreview
                      key={image.id}                      image={image}
                      result={compressionResults.find(
                        (result) => result.original.id === image.id
                      )}
                      onRemove={handleRemoveImage}
                    />
                  ))}
                </div>
              </AnimatePresence>
            </>          )}
        </div>      </div>
      <div className="border-t border-gray-200 mt-10 mb-5 shadow-sm"></div>
      <Footer />
    </div>
  );
}

export default App;
