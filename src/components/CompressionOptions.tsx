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
    >      <div className="py-3 px-5 border-b border-gray-100">
        <h3 className="text-lg font-medium text-gray-800 flex items-center">
          <svg className="mr-2 w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 16V8.00002C20.9996 7.6493 20.9071 7.30483 20.7315 7.00119C20.556 6.69754 20.3037 6.44539 20 6.27002L13 2.27002C12.696 2.09449 12.3511 2.00208 12 2.00208C11.6489 2.00208 11.304 2.09449 11 2.27002L4 6.27002C3.69626 6.44539 3.44398 6.69754 3.26846 7.00119C3.09294 7.30483 3.00036 7.6493 3 8.00002V16C3.00036 16.3508 3.09294 16.6952 3.26846 16.9989C3.44398 17.3025 3.69626 17.5547 4 17.73L11 21.73C11.304 21.9056 11.6489 21.998 12 21.998C12.3511 21.998 12.696 21.9056 13 21.73L20 17.73C20.3037 17.5547 20.556 17.3025 20.7315 16.9989C20.9071 16.6952 20.9996 16.3508 21 16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3.27002 6.96002L12 12L20.73 6.96002" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 22.08V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Smart Conversion
        </h3>
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
              Server connection error
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
