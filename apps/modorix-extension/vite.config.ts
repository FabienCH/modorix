import react from '@vitejs/plugin-react';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import webExtension, { readJsonFile } from 'vite-plugin-web-extension';

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
      additionalInputs: ['src/scripts/block-user.ts'],
      disableAutoLaunch: true,
      watchFilePaths: ['src', 'public'],
      browser: process.env.TARGET || 'chrome',
    }),
  ],
});
