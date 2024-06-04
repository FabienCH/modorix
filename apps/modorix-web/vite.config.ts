import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
  resolve: {
    alias: [
      {
        find: '@modorix-ui',
        replacement: path.resolve(__dirname, '../../packages/ui/src'),
      },
      {
        find: '@modorix-commons',
        replacement: path.resolve(__dirname, '../../packages/modorix-commons/src'),
      },
    ],
  },
});
