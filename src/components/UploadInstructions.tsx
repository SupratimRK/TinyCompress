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
      <div className="p-4">
        {/* Upload instructions */}        <div className="mb-5 border-b border-gray-100 pb-4">
          <div className="flex items-center mb-2">
            <div className="mr-3">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary">
                <IconUpload className="text-white text-xl" />
              </div>
            </div>
            <div>              <p className="font-medium text-gray-800 text-lg">Upload image to compress</p>
              <p className="text-gray-500 text-sm">Select an image to start the compression process</p>
            </div>
          </div>
        </div>
        
        {/* Buttons in same line - main actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3 border-b border-gray-100 pb-3">          <motion.button 
            onClick={(e) => {
              // Create a new file input element to replace the existing one
              const oldInput = document.getElementById('file-input');
              if (oldInput) {
                const newInput = document.createElement('input');
                newInput.id = 'file-input';
                newInput.type = 'file';
                newInput.className = 'hidden';
                newInput.accept = 'image/jpeg,image/png,image/webp,image/avif';
                
                // Copy the event handler
                newInput.onchange = oldInput.onchange;
                
                // Replace the old input with the new one
                oldInput.parentNode?.replaceChild(newInput, oldInput);
                
                // Click the new input
                newInput.click();
              } else {
                onUploadClick();
              }
            }}
            className="w-full px-5 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium inline-flex items-center justify-center shadow-sm relative overflow-hidden"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          ><span className="relative z-10 flex items-center">
              <IconUpload className="mr-2 w-4 h-4" />
              Upload Image
            </span>{!hasImages && (
              <div className="absolute inset-0 z-0">
                <div className="animate-shimmer absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12" 
                    style={{ backgroundSize: '200% 100%', animationDuration: '1.5s' }} />
              </div>
            )}
          </motion.button>
            <motion.button
            className={`w-full px-5 py-2.5 rounded-lg text-sm font-medium inline-flex items-center justify-center shadow-sm relative overflow-hidden
              ${!isCompressing && hasImages
                ? 'bg-primary text-white shadow-md shadow-primary/20' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
            whileHover={!isCompressing && hasImages ? { scale: 1.02 } : {}}
            whileTap={!isCompressing && hasImages ? { scale: 0.98 } : {}}
            onClick={hasImages ? onCompressClick : undefined}
            disabled={!hasImages || isCompressing}
          >
            {/* Add shimmer effect to the entire button */}
            {hasImages && !hasCompressedImages && !isCompressing && (
              <div className="absolute inset-0 z-0">
                <div className="animate-shimmer absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
                     style={{ backgroundSize: '200% 100%', animationDuration: '1.5s' }} />
              </div>
            )}
            
            <span className="relative z-10 flex items-center">
              {isCompressing ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Compressing...
                </>
              ) : (
                <>
                  <svg className="mr-2 w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 14V20M19 20H13M19 20L13 14M5 10V4M5 4H11M5 4L11 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Compress Image
                </>
              )}
            </span>
          </motion.button>
            <motion.button
            className={`w-full px-5 py-2.5 rounded-lg text-sm font-medium inline-flex items-center justify-center shadow-sm relative overflow-hidden
              ${hasCompressedImages
                ? 'bg-green-600 hover:bg-green-700 text-white' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
            whileHover={hasCompressedImages ? { scale: 1.02 } : {}}
            whileTap={hasCompressedImages ? { scale: 0.98 } : {}}
            onClick={hasCompressedImages ? onDownloadClick : undefined}
            disabled={!hasCompressedImages}
          >
            <span className="relative z-10 flex items-center">
              <IconDownload className="mr-2 w-4 h-4" />
              Download Image
            </span>
            {hasCompressedImages && (
              <div className="absolute inset-0 z-0">
                <div className="animate-shimmer absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12" 
                    style={{ backgroundSize: '200% 100%', animationDuration: '1.5s' }} />
              </div>
            )}
          </motion.button>
        </div>
          {/* Clear all on a separate line - full width on mobile, right-aligned on desktop */}        <div className="pt-1 w-full flex justify-end">
          <motion.button
            className={`w-full sm:w-auto px-5 py-2 rounded-lg text-sm font-medium shadow-sm
              ${hasImages
                ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
            whileHover={hasImages ? { scale: 1.02 } : {}}
            whileTap={hasImages ? { scale: 0.98 } : {}}
            onClick={hasImages ? onClearClick : undefined}
            disabled={!hasImages}
          >
            Clear
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default UploadInstructions;
