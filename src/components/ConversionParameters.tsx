// filepath: ConversionParameters.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface ConversionParametersProps {
  onFormatChange?: (format: string) => void;
  onQualityChange?: (quality: number) => void;
  isAdvanced?: boolean;
}

const qualityPresets = [
  { value: 65, label: '65%' },
  { value: 75, label: '75%' },
  { value: 90, label: '90%' },
  { value: 100, label: '100%' }
];

const ConversionParameters: React.FC<ConversionParametersProps> = ({
  onFormatChange,
  onQualityChange,
  isAdvanced = false,
}) => {
  const [selectedFormat, setSelectedFormat] = useState('same');
  const [quality, setQuality] = useState(75); // Default to 75%
  const [mode, setMode] = useState<'default' | 'advanced'>('default');

  const handleFormatChange = (format: string) => {
    setSelectedFormat(format);
    if (onFormatChange) onFormatChange(format);
  };

  const handleQualityPresetClick = (preset: number) => {
    setQuality(preset);
    if (onQualityChange) onQualityChange(preset);
  };
  
  const toggleMode = () => {
    setMode(mode === 'default' ? 'advanced' : 'default');
  };

  return (
    <motion.div
      className="card bg-white rounded-xl shadow-sm h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <div className="py-3 px-5 border-b border-gray-100">
        <h3 className="text-lg font-medium text-gray-800">Advanced Options</h3>
      </div>

      <div className="p-5 space-y-5">
        {/* Mode Toggle */}
        <div className="flex justify-center mb-2">
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setMode('default')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                mode === 'default'
                  ? 'bg-white shadow-sm text-gray-800'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Default
            </button>
            <button
              onClick={() => setMode('advanced')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                mode === 'advanced'
                  ? 'bg-white shadow-sm text-gray-800'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Advanced
            </button>
          </div>
        </div>

        {/* Quality Presets */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
            <span className="h-4 w-1 bg-primary rounded-full mr-2"></span>
            Image Quality
          </h4>
          
          {mode === 'default' ? (
            <div className="grid grid-cols-2 gap-2">
              <motion.button
                onClick={() => handleQualityPresetClick(75)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  quality === 75
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-white border border-gray-200 hover:border-primary/30 hover:bg-gray-50 text-gray-700'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Balanced
              </motion.button>
              <motion.button
                onClick={() => handleQualityPresetClick(90)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  quality === 90
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-white border border-gray-200 hover:border-primary/30 hover:bg-gray-50 text-gray-700'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                High Quality
              </motion.button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {qualityPresets.map(preset => (
                <motion.button
                  key={preset.value}
                  onClick={() => handleQualityPresetClick(preset.value)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    quality === preset.value
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-white border border-gray-200 hover:border-primary/30 hover:bg-gray-50 text-gray-700'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {preset.label}
                </motion.button>
              ))}
            </div>
          )}
        </div>

        {/* Output Format */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
            <span className="h-4 w-1 bg-primary rounded-full mr-2"></span>
            Output Format
          </h4>
          
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'same', label: 'Same as input' },
              { id: 'jpeg', label: 'JPEG' },
              { id: 'png', label: 'PNG' },
              { id: 'webp', label: 'WebP' }
            ].map((format) => (
              <motion.button
                key={format.id}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedFormat === format.id
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-white border border-gray-200 hover:border-primary/30 hover:bg-gray-50 text-gray-700'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleFormatChange(format.id)}
              >
                {format.label}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ConversionParameters;
