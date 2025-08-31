'use client';

import React, { useState, useEffect } from 'react';
import { useDropzone, Accept } from 'react-dropzone';
import { motion } from 'framer-motion';
import { IconUpload, IconImage, IconX } from './icons';
import { ImageFile } from '@/types';

interface DropzoneProps {
  onDrop: (files: File[]) => void;
  maxFiles?: number;
  acceptedFileTypes?: Accept;
  className?: string;
  uploadedFiles?: ImageFile[];
}

const defaultAcceptedFileTypes: Accept = {
  'image/jpeg': [],
  'image/png': [],
  'image/webp': [],
  'image/avif': []
};

const FileUploader: React.FC<DropzoneProps> = ({
  onDrop,
  maxFiles = 1,
  acceptedFileTypes = defaultAcceptedFileTypes,
  className = '',
  uploadedFiles = []
}) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [hasFiles, setHasFiles] = useState(false);
  
  useEffect(() => {
    setHasFiles(uploadedFiles.length > 0);
  }, [uploadedFiles]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: acceptedFileTypes,
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      setIsDragActive(false);
      onDrop(acceptedFiles.slice(0, 1));
    },
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
    noClick: false,
    noKeyboard: false
  });

  const { ref, ...rootProps } = getRootProps();
  
  return (
    <div 
      ref={ref}
      {...rootProps}
      className={`relative w-full min-h-[250px] rounded-2xl border-2 border-dashed p-4 transition-colors cursor-pointer hover:border-blue-500/50 ${
        isDragActive 
          ? 'border-blue-500 bg-blue-500/5' 
          : hasFiles 
            ? 'border-blue-500/30 bg-gray-50' 
            : 'border-gray-300 bg-gray-50'
      } ${className}`}
    >
      <input {...getInputProps()} />
      
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
        >
          <motion.div
            className="w-24 h-24 flex items-center justify-center rounded-full bg-blue-500 mb-4 relative overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <IconUpload className="text-white text-4xl relative z-10" />
            <div className="absolute inset-0 z-0">
              <div className="animate-pulse absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12" />
            </div>
          </motion.div>
          
          <div>
            <div className="relative overflow-hidden inline-block mb-2">
              <p className="text-xl font-medium text-blue-500 relative z-10">
                {isDragActive ? 'Drop image here' : 'Click to upload image'}
              </p>
              <div className="absolute inset-0 z-0">
                <div className="animate-pulse absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/40 to-transparent -skew-x-12" />
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
      ) : (
        <div className="w-full">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <IconImage className="text-blue-500 mr-2" />
              <h3 className="text-lg font-medium">{uploadedFiles.length} {uploadedFiles.length === 1 ? 'Image' : 'Images'} Selected</h3>
            </div>
            <div className="flex items-center gap-2">
              <motion.button
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm flex items-center shadow-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onDrop([]);
                }}
              >
                <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center mr-1.5 relative overflow-hidden">
                  <IconX className="text-gray-700 text-sm relative z-10" />
                  <div className="absolute inset-0 z-0">
                    <div className="animate-pulse absolute inset-0 bg-gradient-to-r from-transparent via-gray-400/30 to-transparent -skew-x-12" />
                  </div>
                </div>
                Clear Image
              </motion.button>
            </div>
          </div>
          
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
          
          {uploadedFiles.length > 1 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 max-h-[120px] overflow-y-auto p-1">
              {uploadedFiles.map((file, index) => (
                <motion.div 
                  key={file.id}
                  className={`aspect-square rounded-lg bg-gray-100 overflow-hidden relative border-2 ${index === 0 ? 'border-blue-500' : 'border-transparent'}`}
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
          className="absolute inset-0 bg-blue-500/10 rounded-2xl z-10 flex items-center justify-center"
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
            <IconUpload className="text-blue-500 text-4xl mx-auto mb-2" />
            <p className="text-lg font-medium">Drop to upload</p>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default FileUploader;