import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import webExtension, { readJsonFile } from "vite-plugin-web-extension";

function generateManifest() {
  const manifest = readJsonFile("src/manifest.json");
  const pkg = readJsonFile("package.json");
  return {
    name: pkg.name,
    description: pkg.description,
    version: pkg.version,
    ...manifest,
  };
}

export default defineConfig({
  build: {
    outDir: process.env.TARGET === "firefox" ? "dist/firefox" : "dist/chrome",
  },
  plugins: [
    react(),
    webExtension({
      manifest: generateManifest,
      additionalInputs: ["src/scripts/block-user.ts"],
      disableAutoLaunch: true,
      watchFilePaths: ["src", "public"],
      browser: process.env.TARGET || "chrome",
    }),
  ],
});
