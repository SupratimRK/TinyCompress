import React from 'react';
import { motion } from 'framer-motion';
import { IconRefreshCw, IconDownload } from '../react-icons-fix';
import { useToggle } from '../hooks/useToggle';

interface CompressionControlsProps {
  onCompress: () => void;
  onClear: () => void;
  onDownloadAll: () => void;
  isCompressing: boolean;
  hasCompressedImages: boolean;
  hasSelectedImages: boolean;
  showCompressed: boolean;
  onToggleView: () => void;
}

const CompressionControls: React.FC<CompressionControlsProps> = ({
  onCompress,
  onClear,
  onDownloadAll,
  isCompressing,
  hasCompressedImages,
  hasSelectedImages,
  showCompressed,
  onToggleView
}) => {  return (
    <motion.div 
      className="mb-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      {hasSelectedImages ? (
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex flex-wrap gap-3 justify-between items-center">
            <div className="flex flex-wrap gap-2">
              <motion.button
                className={`px-4 py-2.5 rounded-lg text-sm font-medium inline-flex items-center
                ${!isCompressing ? 'bg-primary text-white shadow-md shadow-primary/20' : 'bg-primary/80 text-white/90 cursor-wait'}`}
                whileHover={!isCompressing ? { scale: 1.02, boxShadow: "0 10px 15px -3px rgba(var(--color-primary-rgb), 0.3)" } : {}}
                whileTap={!isCompressing ? { scale: 0.98 } : {}}
                onClick={onCompress}
                disabled={!hasSelectedImages || isCompressing}
              >
                {isCompressing ? (
                  <>
                    <IconRefreshCw className="animate-spin mr-2" />
                    Compressing...
                  </>
                ) : (
                  'Compress Images'
                )}
              </motion.button>

              <motion.button
                className="px-4 py-2.5 rounded-lg text-sm font-medium border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClear}
                disabled={!hasSelectedImages}
              >
                Clear All
              </motion.button>
            </div>

            <div className="flex flex-wrap gap-2 items-center">
              {hasCompressedImages && (
                <>
                  <motion.button
                    className="px-4 py-2.5 rounded-lg text-sm font-medium bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200 inline-flex items-center"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onDownloadAll}
                  >
                    <IconDownload className="mr-1.5" /> Download All
                  </motion.button>
                  
                  <motion.div
                    className="flex bg-gray-100 p-1 rounded-lg"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.button
                      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                        !showCompressed ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-600'
                      }`}
                      whileHover={!showCompressed ? {} : { scale: 1.02 }}
                      whileTap={!showCompressed ? {} : { scale: 0.98 }}
                      onClick={onToggleView}
                      disabled={!showCompressed}
                    >
                      Original
                    </motion.button>
                    <motion.button
                      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                        showCompressed ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-600'
                      }`}
                      whileHover={showCompressed ? {} : { scale: 1.02 }}
                      whileTap={showCompressed ? {} : { scale: 0.98 }}
                      onClick={onToggleView}
                      disabled={showCompressed}
                    >
                      Compressed
                    </motion.button>
                  </motion.div>
                </>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
          <p className="text-gray-500 text-sm">Upload images to start compression</p>
        </div>
      )}
    </motion.div>
  );
};

export default CompressionControls;
