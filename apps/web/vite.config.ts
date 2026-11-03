import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React core — cached almost forever
          'vendor-react': ['react', 'react-dom'],
          // Recharts is large — split it out
          'vendor-recharts': ['recharts'],
          // Framer Motion — split separately
          'vendor-framer': ['framer-motion'],
          // Supabase client
          'vendor-supabase': ['@supabase/supabase-js'],
          // Lucide icons
          'vendor-lucide': ['lucide-react'],
        },
      },
    },
    // Raise the warning threshold to 600 KB (individual chunks are now all smaller)
    chunkSizeWarningLimit: 600,
  },
});
