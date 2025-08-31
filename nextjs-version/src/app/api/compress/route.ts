import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageData, targetSizeKB } = body;

    if (!imageData) {
      return NextResponse.json(
        { error: 'Image data is required' },
        { status: 400 }
      );
    }

    // Base64 decode the image data
    const base64Data = imageData.split(',')[1];
    const buffer = Buffer.from(base64Data, 'base64');
    const originalSize = buffer.length;

    let result;

    if (targetSizeKB && targetSizeKB > 0) {
      // Target size compression with binary search
      const targetSizeBytes = targetSizeKB * 1024;
      
      // First, try basic compression
      const compressed = await sharp(buffer)
        .jpeg({ quality: 80, progressive: true })
        .toBuffer();

      if (compressed.length <= targetSizeBytes) {
        // Already meets target size
        result = {
          compressedImage: `data:image/jpeg;base64,${compressed.toString('base64')}`,
          originalSize,
          compressedSize: compressed.length,
          compressionRatio: ((originalSize - compressed.length) / originalSize) * 100
        };
      } else {
        // Use binary search to find optimal quality and size
        let minQuality = 10;
        let maxQuality = 80;
        let bestResult = compressed;

        // Get image metadata for resizing if needed
        const metadata = await sharp(buffer).metadata();

        // Binary search for quality
        for (let i = 0; i < 8; i++) {
          const quality = Math.round((minQuality + maxQuality) / 2);
          
          const testCompressed = await sharp(buffer)
            .jpeg({ quality, progressive: true })
            .toBuffer();

          if (testCompressed.length <= targetSizeBytes) {
            minQuality = quality;
            bestResult = testCompressed;
          } else {
            maxQuality = quality;
          }
        }

        // If quality reduction isn't enough, try scaling down
        if (bestResult.length > targetSizeBytes && metadata.width && metadata.height) {
          let minScale = 0.1;
          let maxScale = 1.0;

          for (let i = 0; i < 8; i++) {
            const scale = (minScale + maxScale) / 2;
            const newWidth = Math.round(metadata.width * scale);
            const newHeight = Math.round(metadata.height * scale);

            const testCompressed = await sharp(buffer)
              .resize(newWidth, newHeight)
              .jpeg({ quality: 60, progressive: true })
              .toBuffer();

            if (testCompressed.length <= targetSizeBytes) {
              minScale = scale;
              bestResult = testCompressed;
            } else {
              maxScale = scale;
            }
          }
        }

        result = {
          compressedImage: `data:image/jpeg;base64,${bestResult.toString('base64')}`,
          originalSize,
          compressedSize: bestResult.length,
          compressionRatio: ((originalSize - bestResult.length) / originalSize) * 100
        };
      }
    } else {
      // Basic compression without target size
      const compressed = await sharp(buffer)
        .jpeg({ quality: 80, progressive: true })
        .toBuffer();

      result = {
        compressedImage: `data:image/jpeg;base64,${compressed.toString('base64')}`,
        originalSize,
        compressedSize: compressed.length,
        compressionRatio: ((originalSize - compressed.length) / originalSize) * 100
      };
    }

    return NextResponse.json({
      ...result,
      success: true
    });

  } catch (error) {
    console.error('Compression error:', error);
    
    let errorMessage = 'Failed to compress image';
    let statusCode = 500;

    if (error instanceof Error) {
      if (error.message.includes('Input buffer contains unsupported image format')) {
        errorMessage = 'Unsupported image format. Please use JPEG, PNG, WebP, or other supported formats.';
        statusCode = 400;
      } else if (error.message.includes('Input image exceeds pixel limit')) {
        errorMessage = 'Image is too large. Please use a smaller image.';
        statusCode = 413;
      }
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
}