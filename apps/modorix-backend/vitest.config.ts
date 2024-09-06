import swc from 'unplugin-swc';
import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    root: './',
  },
  resolve: {
    alias: [
      {
        find: '@modorix-commons',
        replacement: path.resolve(__dirname, '../../packages/modorix-commons/src'),
      },
    ],
  },
  plugins: [swc.vite()],
});
