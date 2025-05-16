import React from 'react';
import { motion } from 'framer-motion';
import { SizeOption } from '../types';
import { IconCheck } from '../react-icons-fix';

interface CompressionOptionsProps {
  sizeOptions: SizeOption[];
  selectedSizeOption: SizeOption | null;
  onSelectOption: (option: SizeOption) => void;
  serviceConnected: boolean;
  serviceError?: string | null;
}

const CompressionOptions: React.FC<CompressionOptionsProps> = ({
  sizeOptions,
  selectedSizeOption,
  onSelectOption,
  serviceConnected,
  serviceError
}) => {  return (
    <motion.div 
      className="card bg-white rounded-xl shadow-sm h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="py-3 px-5 border-b border-gray-100">
        <h3 className="text-lg font-medium text-gray-800">Smart Conversion</h3>
      </div>

      <div className="p-5 space-y-5">
        <div className="mb-2">
          {serviceConnected ? (
            <motion.div 
              className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full text-green-600 text-sm font-medium"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 17 }}
            >
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <IconCheck className="mr-1" />
              Ready to compress
            </motion.div>
          ) : (
            <motion.div 
              className="flex items-center gap-2 px-3 py-1.5 bg-red-50 rounded-full text-red-600 text-sm font-medium"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 17 }}
            >
              <div className="w-2 h-2 rounded-full bg-red-500" />
              API connection error
              {serviceError && (
                <span className="hidden sm:inline ml-1 text-xs max-w-md truncate">
                  ({serviceError})
                </span>
              )}
            </motion.div>
          )}
          
          <p className="text-gray-600 text-sm mt-3">
            Our advanced compression algorithm intelligently reduces image file sizes while preserving visual quality.
          </p>
        </div>
      
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
            <span className="h-4 w-1 bg-primary rounded-full mr-2"></span>
            Target File Size
          </h4>
          
          <div className="grid grid-cols-2 gap-2">
            {sizeOptions.map((option) => (
              <motion.button
                key={option.id}
                className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  selectedSizeOption?.id === option.id
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-white border border-gray-200 hover:border-primary/30 hover:bg-gray-50 text-gray-700'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelectOption(option)}
                disabled={!serviceConnected}
              >
                {option.label}
              </motion.button>
            ))}
          </div>        </div>
      </div>
    </motion.div>
  );
};

export default CompressionOptions;
