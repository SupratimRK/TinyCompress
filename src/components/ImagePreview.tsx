import React from 'react';
import { motion } from 'framer-motion';
import { IconX, IconDownload, IconImage } from '../react-icons-fix';
import { ImageFile } from '../hooks/useImageFiles';
import { CompressionResult, CompressionStatus } from '../types';

interface ImagePreviewProps {
  image: ImageFile;
  result?: CompressionResult;
  onRemove: (id: string) => void;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({
  image,
  result,
  onRemove
}) => {
  const isCompressed = result && result.status === CompressionStatus.SUCCESS;
  const isLoading = result && result.status === CompressionStatus.LOADING;
  const isError = result && result.status === CompressionStatus.ERROR;
    const displayImage = isCompressed
    ? { src: result.compressed.url } 
    : { src: image.preview };
  
  const handleDownload = () => {
    if (isCompressed) {
      const link = document.createElement('a');
      link.href = result.compressed.url;
      link.download = `compressed-${image.file.name}`;
      link.click();
    }
  };

  // Format file size to readable format
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };  return (
    <motion.div 
      className="relative bg-white rounded-lg shadow-sm overflow-hidden group border border-gray-100"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      layout
      whileHover={{ scale: 1.03, boxShadow: "0 5px 15px -3px rgba(0, 0, 0, 0.1)" }}
    >
      <div className="aspect-square relative overflow-hidden bg-gray-100">
        {isLoading ? (
          <motion.div 
            className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <div className="w-8 h-8 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          </motion.div>
        ) : null}
        
        {isError ? (
          <motion.div 
            className="absolute inset-0 flex flex-col items-center justify-center bg-red-500/90 text-white z-10 p-2 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <div className="bg-white/10 rounded-full p-1 mb-1">
              <IconX className="text-sm" />
            </div>
            <p className="text-xs font-medium">Error</p>
            <motion.button 
              className="mt-1 bg-white/20 hover:bg-white/30 text-xs py-1 px-2 rounded-full text-[10px]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onRemove(image.id)}
            >
              Try Again
            </motion.button>
          </motion.div>
        ) : null}
        
        <img
          src={displayImage.src}
          alt={image.file.name}
          className="w-full h-full object-cover"
        />
        
        {isCompressed && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-primary to-green-500 text-white text-[10px] font-medium py-0.5 px-2">
            {Math.round(result.compressed.compressionRatio)}% smaller
          </div>
        )}
        
        <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <motion.button
            className="w-6 h-6 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-gray-700 hover:bg-white shadow-sm"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onRemove(image.id)}
          >
            <IconX className="w-3 h-3" />
          </motion.button>
        </div>
        
        {isCompressed && (
          <div className="absolute top-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <motion.button
              className="w-6 h-6 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-primary hover:bg-white shadow-sm"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleDownload}
            >
              <IconDownload className="w-3 h-3" />
            </motion.button>
          </div>
        )}
      </div>
      
      <div className="p-2 text-xs bg-gradient-to-b from-white to-gray-50">
        <p className="font-medium text-gray-800 truncate" title={image.file.name}>
          {image.file.name}
        </p>
        
        <div className="flex justify-between items-center mt-0.5">
          <div className="text-gray-500 text-[10px]">
            {isCompressed ? (
              <div className="flex items-center gap-1">
                <span className="line-through text-gray-400">
                  {formatFileSize(image.file.size)}
                </span>
                <span className="text-green-600 font-medium">
                  {formatFileSize(result.compressed.compressedSize)}
                </span>
              </div>
            ) : (
              <span>{formatFileSize(image.file.size)}</span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ImagePreview;
