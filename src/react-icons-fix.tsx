/**
 * This file provides wrapper components for React Icons to fix TypeScript errors
 * with newer TypeScript/React versions
 * 
 * This implementation uses createElement instead of JSX to avoid TypeScript errors
 */
import React from 'react';
import { 
  FiInfo, 
  FiRefreshCw, 
  FiDownload, 
  FiCheck, 
  FiUpload, 
  FiImage, 
  FiX,
  FiHeart
} from 'react-icons/fi';

interface IconProps {
  size?: number;
  className?: string;
  color?: string;
  [key: string]: any; // Allow any other props
}

// NOTE: The 'as any' cast is needed to bypass TypeScript strictness in React 19
export const IconInfo: React.FC<IconProps> = (props) => React.createElement(FiInfo as any, props);
export const IconRefreshCw: React.FC<IconProps> = (props) => React.createElement(FiRefreshCw as any, props);
export const IconDownload: React.FC<IconProps> = (props) => React.createElement(FiDownload as any, props);
export const IconCheck: React.FC<IconProps> = (props) => React.createElement(FiCheck as any, props);
export const IconUpload: React.FC<IconProps> = (props) => React.createElement(FiUpload as any, props);
export const IconImage: React.FC<IconProps> = (props) => React.createElement(FiImage as any, props);
export const IconX: React.FC<IconProps> = (props) => React.createElement(FiX as any, props);
export const IconHeart: React.FC<IconProps> = (props) => React.createElement(FiHeart as any, props);
