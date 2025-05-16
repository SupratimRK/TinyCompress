import React from 'react';
import { motion } from 'framer-motion';
import { IconHeart } from '../react-icons-fix';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (    <motion.footer 
      className="w-full py-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-lg font-semibold text-primary mb-1">TinyCompress</h3>
            <p className="text-sm text-gray-500">
              Simple image compression for your needs.
            </p>
          </div>
          
          <div className="flex flex-col items-center md:items-end">
            <div className="flex items-center mb-2">
              <p className="text-sm text-gray-500 mr-2">Crafted with</p>
              <IconHeart className="text-red-500 w-4 h-4" />
            </div>
            <p className="text-xs text-gray-400">
              &copy; {currentYear} TinyCompress. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
