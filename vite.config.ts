import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr(),
    tsconfigPaths()
  ],
  resolve: {
    alias: {
      // Handle browser API polyfills if needed
      'stream': 'stream-browserify',
      'buffer': 'buffer-browserify',
      'https': 'https-browserify',
      'http': 'stream-http',
    }
  },
  server: {
    port: 3000, // Keep the same port as Create React App
  },
  build: {
    outDir: 'build', // Keep the same output directory as Create React App
    sourcemap: true,
  },
  // Environment variables prefix handling
  envPrefix: 'REACT_APP_', // Keep compatibility with CRA env vars
});
