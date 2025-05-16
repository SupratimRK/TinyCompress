/**
 * This file provides wrapper components for Lucide React icons
 * 
 * Using Lucide icons for better quality and consistency
 */
import React from 'react';
import { 
  Info, 
  RefreshCw, 
  Download, 
  Check, 
  Upload, 
  Image, 
  X,
  Heart,
  Minimize2,
  ImagePlus
} from 'lucide-react';

interface IconProps {
  size?: number;
  className?: string;
  color?: string;
  strokeWidth?: number;
  [key: string]: any; // Allow any other props
}

// Export Lucide icons with consistent interface
export const IconInfo: React.FC<IconProps> = (props) => <Info {...props} />;
export const IconRefreshCw: React.FC<IconProps> = (props) => <RefreshCw {...props} />;
export const IconDownload: React.FC<IconProps> = (props) => <Download {...props} />;
export const IconCheck: React.FC<IconProps> = (props) => <Check {...props} />;
export const IconUpload: React.FC<IconProps> = (props) => <Upload {...props} />;
export const IconImage: React.FC<IconProps> = (props) => <Image {...props} />;
export const IconX: React.FC<IconProps> = (props) => <X {...props} />;
export const IconHeart: React.FC<IconProps> = (props) => <Heart {...props} />;
// Add compression icon
export const IconCompress: React.FC<IconProps> = (props) => <Minimize2 {...props} />;
export const IconImagePlus: React.FC<IconProps> = (props) => <ImagePlus {...props} />;
