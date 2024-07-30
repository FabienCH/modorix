import react from '@vitejs/plugin-react';
import path from 'path';
import svgr from 'vite-plugin-svgr';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './config/tests/tests-setup.ts',
  },
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
