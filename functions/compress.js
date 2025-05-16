const tinify = require('tinify');
const { Buffer } = require('buffer');

// Define allowed origins
const ALLOWED_ORIGINS = [
  'https://tiny.toolhub.live',
  'http://localhost:8888' // Specifically allow localhost on port 8888
];

// Handler for the compress image function
exports.handler = async function(event, context) {
  const requestOrigin = event.headers.origin;
  
  // Initialize response headers
  const responseHeaders = {
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS', // Important for preflight
  };

  // Dynamically set Access-Control-Allow-Origin
  if (requestOrigin) {
    if (ALLOWED_ORIGINS.includes(requestOrigin)) { // Simplified check
      responseHeaders['Access-Control-Allow-Origin'] = requestOrigin;
    }
    // If origin is not in ALLOWED_ORIGINS,
    // 'Access-Control-Allow-Origin' will not be set.
    // The browser will then block the cross-origin request.
  }
  // If no requestOrigin (e.g. same-origin, curl), ACAO is not set, which is fine.

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204, // 204 No Content is standard for successful preflights
      headers: responseHeaders, // Send the determined headers
      body: '' // Body must be empty for 204
    };
  }
  
  try {
    // Only accept POST requests
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        headers: responseHeaders, // Use determined headers
        body: JSON.stringify({ error: 'Method Not Allowed' })
      };
    }
    
    const body = JSON.parse(event.body);
    const { imageData, targetSizeKB } = body;
    
    // Use the API key from environment variable
    const apiKey = process.env.TINYPNG_API_KEY;
    
    // Validate required inputs
    if (!apiKey) {
      return {
        statusCode: 400,
        headers: responseHeaders, // Use determined headers
        body: JSON.stringify({ error: 'TinyPNG API key is not configured on the server' })
      };
    }
    
    if (!imageData) {
      return {
        statusCode: 400,
        headers: responseHeaders, // Use determined headers
        body: JSON.stringify({ error: 'Image data is required' })
      };
    }
    
    // Set the API key
    tinify.key = apiKey;
    
    // Validate the API key by retrieving the compression count
    try {
      await tinify.validate();
      const compressionsThisMonth = tinify.compressionCount;
      
      // Base64 decode the image data
      const buffer = Buffer.from(imageData.split(',')[1], 'base64');
      
      // Create source from buffer
      const source = tinify.fromBuffer(buffer);
      
      let result;
      
      // If target size is specified, resize to fit target size
      if (targetSizeKB && targetSizeKB > 0) {
        // First, compress the image
        let compressedData = await source.toBuffer();
        
        // Calculate initial compression ratio
        const initialSize = buffer.length;
        const compressedSize = compressedData.length;
        
        // If the compressed size is already smaller than target, return it
        const targetSizeBytes = targetSizeKB * 1024;
        
        if (compressedSize <= targetSizeBytes) {
          result = {
            compressedImage: `data:image/png;base64,${compressedData.toString('base64')}`,
            originalSize: initialSize,
            compressedSize: compressedSize,
            compressionRatio: ((initialSize - compressedSize) / initialSize) * 100
          };
        } else {
          // We need to resize further to meet target size
          // Let's try scaling down proportionally
          
          // First, get the dimensions by resizing to original size
          const resized = source.resize({
            method: "scale",
            width: 10000  // A large number to essentially get original dimensions
          });
          
          // Use binary search to find the best dimensions
          let minScale = 0.1; // Minimum scale: 10% of original
          let maxScale = 1.0; // Maximum scale: 100% of original
          let bestResult = null;
          
          for (let i = 0; i < 6; i++) { // 6 iterations usually converges well
            const midScale = (minScale + maxScale) / 2;
            
            // Scale down to current test size
            const scaledSource = source.resize({
              method: "scale",
              width: Math.round(1000 * midScale) // Arbitrary base size
            });
            
            // Get the buffer of this scaled image
            const scaledData = await scaledSource.toBuffer();
            
            if (scaledData.length <= targetSizeBytes) {
              // This size works, try larger
              minScale = midScale;
              bestResult = {
                data: scaledData,
                size: scaledData.length
              };
            } else {
              // Too large, try smaller
              maxScale = midScale;
            }
          }
          
          // Use the best result we found
          if (bestResult) {
            result = {
              compressedImage: `data:image/png;base64,${bestResult.data.toString('base64')}`,
              originalSize: initialSize,
              compressedSize: bestResult.size,
              compressionRatio: ((initialSize - bestResult.size) / initialSize) * 100
            };
          } else {
            // Fallback to the initially compressed image
            result = {
              compressedImage: `data:image/png;base64,${compressedData.toString('base64')}`,
              originalSize: initialSize,
              compressedSize: compressedSize,
              compressionRatio: ((initialSize - compressedSize) / initialSize) * 100
            };
          }
        }
      } else {
        // Basic compression without target size
        const compressedData = await source.toBuffer();
        
        result = {
          compressedImage: `data:image/png;base64,${compressedData.toString('base64')}`,
          originalSize: buffer.length,
          compressedSize: compressedData.length,
          compressionRatio: ((buffer.length - compressedData.length) / buffer.length) * 100
        };
      }
      
      // Return success response
      return {
        statusCode: 200,
        headers: responseHeaders, // Use determined headers
        body: JSON.stringify({
          ...result,
          compressionsThisMonth,
          remainingCompression: 500 - compressionsThisMonth, // Free tier has 500 compressions/month
          success: true
        })
      };
        } catch (validateError) {
      console.error('API key validation error:', validateError);
      
      // Provide more specific error messages based on common issues
      let errorMessage = 'Invalid API key or TinyPNG service error';
      
      if (validateError.message && validateError.message.includes('401')) {
        errorMessage = 'Invalid TinyPNG API key. Please check your credentials.';
      } else if (validateError.message && validateError.message.includes('429')) {
        errorMessage = 'Monthly compression limit exceeded. TinyPNG free accounts allow 500 compressions per month.';
      }
      
      return {
        statusCode: 401,
        headers: responseHeaders, // Use determined headers
        body: JSON.stringify({ 
          error: errorMessage,
          details: validateError.message
        })
      };
    }
    
  } catch (error) {
    console.error('Function error:', error);
    
    // Provide more specific error messages based on error type
    let errorMessage = 'Internal Server Error';
    let statusCode = 500;
    
    if (error instanceof SyntaxError && error.message.toLowerCase().includes('json')) {
      errorMessage = 'Invalid JSON in request body. Please ensure the request body is correctly formatted.';
      statusCode = 400; // Bad Request
    } else if (!process.env.TINYPNG_API_KEY) { // Check moved here for clarity, though ideally caught earlier
      errorMessage = 'TinyPNG API key is missing. Please set it in your environment variables.';
      statusCode = 400; // Bad Request or 500 if server config issue
    } else if (error.message && error.message.includes('NetworkError')) {
      errorMessage = 'Network error when contacting TinyPNG API. Please check your internet connection.';
      // statusCode remains 500 as it's an issue on the server's side to connect externally
    } else if (error.message && error.message.toLowerCase().includes('memory')) {
      errorMessage = 'The image is too large to process. Please try with a smaller image.';
      statusCode = 413; // Payload Too Large
    }
    
    return {
      statusCode: statusCode,
      headers: responseHeaders, // Use determined headers
      body: JSON.stringify({ 
        error: errorMessage,
        details: error.message // It's good practice to not expose raw error messages in production
      })
    };
  }
};
