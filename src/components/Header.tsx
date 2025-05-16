import React from 'react';
import { motion } from 'framer-motion';
import { IconImage } from '../react-icons-fix';

const Header: React.FC = () => {  
  return (
    <motion.header 
      className="py-6 mb-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col items-center justify-center">
        <motion.div 
          className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-3 shadow-lg shadow-primary/10"
          animate={{ 
            scale: [1, 1.05, 1],
            rotate: [0, 2, 0, -2, 0],
            background: ["rgba(var(--color-primary-rgb), 0.1)", "rgba(var(--color-primary-rgb), 0.15)", "rgba(var(--color-primary-rgb), 0.1)"]
          }}
          transition={{ 
            duration: 5,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          <IconImage size={32} className="text-primary" />
        </motion.div>
        
        <div className="text-center">          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            <span className="text-primary">Tiny</span>Compress
          </h1>
          <p className="text-gray-600 text-sm max-w-md mx-auto">
            Compress and optimize your images without losing quality
          </p>
        </div>
        
        <motion.div 
          className="flex items-center gap-2 mt-4 text-xs text-gray-500 bg-white/80 px-3 py-1 rounded-full shadow-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
          Fast, secure, and completely free
        </motion.div>
      </div>
    </motion.header>
  );
};

export default Header;
