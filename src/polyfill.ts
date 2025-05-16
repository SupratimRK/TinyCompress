// This file provides a polyfill for the Node.js Buffer class in the browser
// It's needed because the tinify library expects Buffer to be available

if (typeof window !== 'undefined') {
  // Create a minimal Buffer implementation with proper TypeScript handling
  // @ts-ignore - We're implementing a simplified version of Buffer
  window.Buffer = {
    // @ts-ignore - Simplified implementation ignoring full Buffer interface
    from: (data: any): Uint8Array => {
      if (data instanceof Uint8Array) {
        return data;
      }
      // Handle ArrayBuffer case
      if (data instanceof ArrayBuffer) {
        return new Uint8Array(data);
      }
      // Handle string case by using TextEncoder
      if (typeof data === 'string') {
        return new TextEncoder().encode(data);
      }
      // For other cases, try to convert to array
      return new Uint8Array(Array.isArray(data) ? data : []);
    }
  };
}

export {};
