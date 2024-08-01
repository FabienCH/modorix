import react from '@vitejs/plugin-react';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import webExtension, { readJsonFile } from 'vite-plugin-web-extension';
import { defineConfig } from 'vitest/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function generateManifest() {
  const manifest = readJsonFile('src/manifest.json');
  const pkg = readJsonFile('package.json');
  return {
    name: pkg.name,
    description: pkg.description,
    version: pkg.version,
    ...manifest,
  };
}

export default defineConfig({
  build: {
    outDir: process.env.TARGET === 'firefox' ? 'dist/firefox' : 'dist/chrome',
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './config/tests/tests-setup.ts',
  },
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
  plugins: [
    react(),
    webExtension({
      manifest: generateManifest,
      additionalInputs: [
        'src/content/scripts/block-user.ts',
        'src/content/scripts/block-request-listener.ts',
        'src/content/scripts/x-request-listener.ts',
      ],
      disableAutoLaunch: true,
      watchFilePaths: ['src', 'public'],
      browser: process.env.TARGET || 'chrome',
    }),
  ],
});
