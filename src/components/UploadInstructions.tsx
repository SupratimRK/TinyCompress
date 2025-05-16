import React from 'react';
import { motion } from 'framer-motion';
import { IconUpload, IconDownload } from '../react-icons-fix';

interface UploadInstructionsProps {
  onUploadClick: () => void;
  onCompressClick: () => void;
  onDownloadClick: () => void;
  onClearClick: () => void;
  isCompressing: boolean;
  hasImages: boolean;
  hasCompressedImages: boolean;
}

const UploadInstructions: React.FC<UploadInstructionsProps> = ({
  onUploadClick,
  onCompressClick,
  onDownloadClick,
  onClearClick,
  isCompressing,
  hasImages,
  hasCompressedImages
}) => {
  return (
    <motion.div
      className="mb-6 bg-white rounded-xl shadow-sm border border-gray-100"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-4">        {/* Upload instructions */}
        <div className="flex flex-col sm:flex-row items-center mb-5 border-b border-gray-100 pb-4">
          <div className="flex items-center mb-3 sm:mb-0 sm:mr-auto">
            <div className="w-14 h-14 rounded-full bg-white border-2 border-primary/30 flex items-center justify-center mr-4 relative overflow-hidden shadow-md shadow-primary/10">
              <div className="w-11 h-11 flex items-center justify-center rounded-full bg-primary/10 relative overflow-hidden">
                <IconUpload className="text-primary text-2xl relative z-10" />
                <div className="absolute inset-0 z-0">
                  <div className="animate-shimmer absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent -skew-x-12" 
                      style={{ backgroundSize: '200% 100%' }} />
                </div>
              </div>
            </div>
            <div>
              <p className="font-medium text-gray-800 text-lg">Upload image to compress</p>
              <p className="text-gray-500 text-sm">Select your images to start the compression process</p>
            </div>
          </div>
        </div>
          {/* Buttons in same line - main actions */}
        <div className="flex flex-wrap gap-3 mb-3 border-b border-gray-100 pb-3">
          <motion.button 
            onClick={onUploadClick}
            className="px-5 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium inline-flex items-center shadow-sm"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <IconUpload className="mr-2 w-4 h-4" />
            Upload Images
          </motion.button>
          
          <motion.button
            className={`px-5 py-2.5 rounded-lg text-sm font-medium inline-flex items-center shadow-sm
              ${!isCompressing && hasImages
                ? 'bg-primary text-white shadow-md shadow-primary/20' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
            whileHover={!isCompressing && hasImages ? { scale: 1.02 } : {}}
            whileTap={!isCompressing && hasImages ? { scale: 0.98 } : {}}
            onClick={hasImages ? onCompressClick : undefined}
            disabled={!hasImages || isCompressing}
          >
            {isCompressing ? 'Compressing...' : 'Compress Images'}
          </motion.button>
          
          <motion.button
            className={`px-5 py-2.5 rounded-lg text-sm font-medium inline-flex items-center shadow-sm
              ${hasCompressedImages
                ? 'bg-green-600 hover:bg-green-700 text-white' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
            whileHover={hasCompressedImages ? { scale: 1.02 } : {}}
            whileTap={hasCompressedImages ? { scale: 0.98 } : {}}
            onClick={hasCompressedImages ? onDownloadClick : undefined}
            disabled={!hasCompressedImages}
          >
            <IconDownload className="mr-2 w-4 h-4" />
            Download All
          </motion.button>
        </div>
        
        {/* Clear all on a separate line */}
        <div className="flex justify-end pt-1">          <motion.button
            className={`px-5 py-2 rounded-lg text-sm font-medium shadow-sm
              ${hasImages
                ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
            whileHover={hasImages ? { scale: 1.02 } : {}}
            whileTap={hasImages ? { scale: 0.98 } : {}}
            onClick={hasImages ? onClearClick : undefined}
            disabled={!hasImages}
          >
            Clear All
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

export default UploadInstructions;
