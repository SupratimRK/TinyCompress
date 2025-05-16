import React from 'react';
import { motion } from 'framer-motion';
import { CompressionResult, CompressionStatus } from '../types';
import { IconDownload, IconUpload } from '../react-icons-fix';

interface CompressionStatsProps {
  results: CompressionResult[];
  onDownloadAll?: () => void;
  onCompressNew?: () => void;
}

const CompressionStats: React.FC<CompressionStatsProps> = ({ results, onDownloadAll, onCompressNew }) => {
  const successfulResults = results.filter(
    (result) => result.status === CompressionStatus.SUCCESS
  );
  
  // No stats to display if no successful compressions
  if (successfulResults.length === 0) return null;
  
  // Calculate total stats
  const totalOriginalSize = successfulResults.reduce(
    (total, result) => total + result.original.file.size,
    0
  );
  
  const totalCompressedSize = successfulResults.reduce(
    (total, result) => total + result.compressed.compressedSize,
    0
  );
  
  const savedSize = totalOriginalSize - totalCompressedSize;
  const compressionRatio = (savedSize / totalOriginalSize) * 100;
  
  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
    return (
    <motion.div 
      className="mb-8 bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="bg-gradient-to-r from-primary/10 to-accent/30 px-6 py-4 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Compression Results</h3>
            <p className="text-gray-600 text-sm">
              {successfulResults.length} {successfulResults.length === 1 ? 'image' : 'images'} compressed successfully
            </p>
          </div>
            <div className="flex flex-wrap items-center gap-2 mt-3 sm:mt-0">
            {onCompressNew && (
              <motion.button
                className="inline-flex items-center px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg shadow-sm hover:bg-gray-50 font-medium text-sm"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onCompressNew}
              >
                <IconUpload className="mr-2" /> Compress New Images
              </motion.button>
            )}
            
            {onDownloadAll && (
              <motion.button
                className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg shadow hover:bg-primary/90 font-medium text-sm"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onDownloadAll}
              >
                <IconDownload className="mr-2" /> Download All
              </motion.button>
            )}
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-gray-200/70 flex items-center justify-center mr-3">
                <span className="text-gray-600 text-lg">1</span>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Original Size</p>
                <p className="text-xl font-bold text-gray-800">{formatFileSize(totalOriginalSize)}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full  bg-gray-200/70 flex items-center justify-center mr-3">
                <span className="text-primary text-lg">2</span>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Compressed Size</p>
                <p className="text-xl font-bold text-primary">{formatFileSize(totalCompressedSize)}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center">
              <motion.div 
                className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mr-3"
                animate={{ 
                  scale: [1, 1.05, 1],
                  backgroundColor: ["rgb(220, 252, 231)", "rgb(187, 247, 208)", "rgb(220, 252, 231)"],
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                <span className="text-green-600 text-lg">{Math.round(compressionRatio)}%</span>
              </motion.div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Space Saved</p>
                <p className="text-xl font-bold text-green-600">{formatFileSize(savedSize)}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-primary to-green-500"
              style={{ width: `${compressionRatio}%` }}
              initial={{ width: 0 }}
              animate={{ width: `${compressionRatio}%` }}
              transition={{ duration: 1 }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>Original</span>
            <span>{Math.round(compressionRatio)}% saved</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CompressionStats;
