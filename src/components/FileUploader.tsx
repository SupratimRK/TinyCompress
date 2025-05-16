import React, { useState, useEffect } from 'react';
import { useDropzone, Accept } from 'react-dropzone';
import { motion } from 'framer-motion';
// Import our fixed icon components
import { IconUpload, IconImage } from '../react-icons-fix'; 
import { ImageFile } from '../hooks/useImageFiles';

interface DropzoneProps {
  onDrop: (files: File[]) => void;
  maxFiles?: number;
  acceptedFileTypes?: Accept;
  className?: string;
  uploadedFiles?: ImageFile[]; // Added to show uploaded files
}

const defaultAcceptedFileTypes: Accept = {
  'image/jpeg': [],
  'image/png': [],
  'image/webp': [],
  'image/avif': []
};

const FileUploader: React.FC<DropzoneProps> = ({
  onDrop,
  maxFiles = 1, // Changed default to 1 for single image upload
  acceptedFileTypes = defaultAcceptedFileTypes,
  className = '',
  uploadedFiles = []
}) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [hasFiles, setHasFiles] = useState(false);
  
  // Update hasFiles state when uploadedFiles change
  useEffect(() => {
    setHasFiles(uploadedFiles.length > 0);
  }, [uploadedFiles]);
    const { getRootProps, getInputProps, open } = useDropzone({
    accept: acceptedFileTypes,
    maxFiles: 1, // Enforce single file upload
    onDrop: (acceptedFiles) => {
      setIsDragActive(false);
      // Only pass the first file if multiple are somehow selected
      onDrop(acceptedFiles.slice(0, 1));
    },
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
    // Allow clicking anywhere in the uploader area
    noClick: false,
    noKeyboard: false
  });

  // Extract needed props while avoiding TypeScript conflicts
  const { ref, ...rootProps } = getRootProps();
  
  return (
    <div 
      ref={ref}
      {...rootProps}
      className={`relative w-full min-h-[250px] rounded-2xl border-2 border-dashed p-4 transition-colors cursor-pointer hover:border-primary/50 ${
        isDragActive 
          ? 'border-primary bg-primary/5 file-uploader-drop-active' 
          : hasFiles 
            ? 'border-primary/30 bg-light' 
            : 'border-gray-300 bg-gray-50'
      } ${className}`}
    >
      <input {...getInputProps()} />      <input 
        id="file-input"
        type="file" 
        multiple 
        accept="image/jpeg,image/png,image/webp,image/avif"
        className="hidden"
        onChange={(e) => {
          if (e.target.files) {
            onDrop(Array.from(e.target.files));
            // Reset the file input value to allow selecting the same file again
            e.target.value = '';
          }
        }}
      />
      
      {!hasFiles ? (
        <motion.div 
          className="flex flex-col items-center justify-center text-center space-y-4 w-full h-full min-h-[200px]"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ 
            opacity: 1,
            scale: isDragActive ? 1.05 : 1
          }}
          transition={{ 
            type: "spring", 
            stiffness: 400, 
            damping: 10 
          }}
        >          <motion.div
            className="w-24 h-24 flex items-center justify-center rounded-full bg-primary mb-4 relative overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <IconUpload className="text-white text-4xl relative z-10" />
            {/* Shimmer animation */}
            <div className="absolute inset-0 z-0">
              <div className="animate-shimmer absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12" 
                  style={{ backgroundSize: '200% 100%', animationDuration: '2s' }} />
            </div>
          </motion.div><div>              <div className="relative overflow-hidden inline-block mb-2">                <p className="text-xl font-medium text-primary relative z-10">
                  {isDragActive ? 'Drop image here' : 'Click to upload image'}
                </p>
                <div className="absolute inset-0 z-0">
                  <div className="animate-shimmer-slow absolute inset-0 bg-gradient-to-r from-transparent via-primary/40 to-transparent -skew-x-12" 
                      style={{ backgroundSize: '200% 100%' }} />
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-1">
                Drag & drop an image or click anywhere in this area
              </p>
              <p className="text-xs text-gray-400">
                Supports: JPEG, PNG, WebP, AVIF
              </p>
            </div>
        </motion.div>
      ) : (        <div className="w-full">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <IconImage className="text-primary mr-2" />
              <h3 className="text-lg font-medium">{uploadedFiles.length} {uploadedFiles.length === 1 ? 'Image' : 'Images'} Selected</h3>
            </div>
            <div className="flex items-center gap-2">              <motion.button
                className="px-3 py-1.5 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm flex items-center shadow-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  open();
                }}
              >
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center mr-1.5 relative overflow-hidden">
                  <IconUpload className="text-white text-sm relative z-10" />
                  <div className="absolute inset-0 z-0">
                    <div className="animate-shimmer absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12" 
                         style={{ backgroundSize: '200% 100%' }} />
                  </div>
                </div>
                Add More
              </motion.button>
            </div>
          </div>
          
          {/* Main Preview Image */}
          {uploadedFiles.length > 0 && (
            <div className="mb-4 flex justify-center">
              <motion.div 
                className="aspect-auto max-h-[300px] rounded-lg overflow-hidden bg-gray-100" 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <img 
                  src={uploadedFiles[0].preview} 
                  alt={uploadedFiles[0].file.name}
                  className="max-h-[300px] object-contain w-auto"
                />
              </motion.div>
            </div>
          )}
          
          {/* Thumbnails */}
          {uploadedFiles.length > 1 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 max-h-[120px] overflow-y-auto p-1">
              {uploadedFiles.map((file, index) => (
                <motion.div 
                  key={file.id}
                  className={`aspect-square rounded-lg bg-gray-100 overflow-hidden relative border-2 ${index === 0 ? 'border-primary' : 'border-transparent'}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <img 
                    src={file.preview} 
                    alt={file.file.name}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}
      
      {isDragActive && (
        <motion.div 
          className="absolute inset-0 bg-primary/10 rounded-2xl z-10 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg text-center"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
          >
            <IconUpload className="text-primary text-4xl mx-auto mb-2" />
            <p className="text-lg font-medium">Drop to upload</p>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default FileUploader;
