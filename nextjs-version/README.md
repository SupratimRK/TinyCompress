# TinyCompress - Next.js Version with Sharp

This is a Next.js version of TinyCompress that uses the Sharp image library for local image processing instead of the TinyPNG API. This version offers:

## Key Features

- **Local Processing**: No external API dependencies - all compression happens on your server
- **Sharp Library**: Uses the high-performance Sharp image library for compression
- **Next.js Architecture**: Built with Next.js App Router and API routes
- **Same UI/UX**: Maintains the same beautiful interface as the original version
- **Target Size Compression**: Supports compressing images to specific file sizes (20KB, 50KB, 100KB, 150KB, 250KB, 500KB)
- **Multiple Formats**: Supports JPEG, PNG, WebP, and AVIF input formats
- **Progressive JPEG Output**: Outputs optimized progressive JPEG images

## Technology Stack

- **Next.js 15** with App Router
- **Sharp** for image processing
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Dropzone** for file uploads
- **Lucide React** for icons

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Navigate to the nextjs-version directory:
   ```bash
   cd nextjs-version
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm start
```

## API Routes

### POST /api/compress

Compresses images using Sharp with optional target size.

**Request Body:**
```json
{
  "imageData": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...",
  "targetSizeKB": 100
}
```

**Response:**
```json
{
  "compressedImage": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...",
  "originalSize": 500000,
  "compressedSize": 102400,
  "compressionRatio": 79.52,
  "success": true
}
```

## Compression Algorithm

The compression uses a two-step approach:

1. **Quality Optimization**: Binary search to find optimal JPEG quality
2. **Size Scaling**: If quality reduction isn't enough, scales down image dimensions

This ensures images meet target sizes while maintaining the best possible quality.

## Differences from Original Version

| Feature | Original (TinyPNG) | Next.js (Sharp) |
|---------|-------------------|-----------------|
| Processing | External API | Local server |
| Dependencies | TinyPNG API key | None |
| Rate Limits | 500/month (free) | None |
| Output Format | PNG/JPEG | JPEG (optimized) |
| Offline Support | No | Yes |
| Privacy | Images sent to TinyPNG | Images stay local |

## File Structure

```
nextjs-version/
├── src/
│   ├── app/
│   │   ├── api/compress/
│   │   │   └── route.ts          # Compression API endpoint
│   │   ├── layout.tsx            # App layout
│   │   └── page.tsx              # Main page
│   ├── components/
│   │   ├── FileUploader.tsx      # File upload component
│   │   └── icons.tsx             # Icon exports
│   ├── hooks/
│   │   ├── useImageFiles.ts      # Image file management
│   │   └── useToggle.ts          # Toggle hook
│   ├── services/
│   │   └── imageCompressionService.ts  # Compression service
│   └── types/
│       └── index.ts              # TypeScript types
├── package.json
└── README.md
```

## Performance

- **Sharp**: One of the fastest image processing libraries
- **Local Processing**: No network latency
- **Progressive JPEG**: Better perceived loading performance
- **Binary Search Algorithm**: Efficient target size optimization

## Deployment

This Next.js application can be deployed to:

- **Vercel** (recommended for Next.js)
- **Netlify**
- **Railway**
- **Any Node.js hosting platform**

No additional configuration needed - Sharp works out of the box on most platforms.

## License

Same as the main project - MIT License.
