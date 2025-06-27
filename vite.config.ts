import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/nab-internal-platform-/',
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
