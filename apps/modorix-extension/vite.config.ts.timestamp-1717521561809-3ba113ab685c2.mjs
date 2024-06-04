// vite.config.ts
import react from "file:///home/fabien/dev/modorix/node_modules/@vitejs/plugin-react/dist/index.mjs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "file:///home/fabien/dev/modorix/node_modules/vite/dist/node/index.js";
import webExtension, { readJsonFile } from "file:///home/fabien/dev/modorix/node_modules/vite-plugin-web-extension/dist/index.js";
var __vite_injected_original_import_meta_url = "file:///home/fabien/dev/modorix/apps/modorix-extension/vite.config.ts";
var __filename = fileURLToPath(__vite_injected_original_import_meta_url);
var __dirname = dirname(__filename);
function generateManifest() {
  const manifest = readJsonFile("src/manifest.json");
  const pkg = readJsonFile("package.json");
  return {
    name: pkg.name,
    description: pkg.description,
    version: pkg.version,
    ...manifest
  };
}
var vite_config_default = defineConfig({
  build: {
    outDir: process.env.TARGET === "firefox" ? "dist/firefox" : "dist/chrome"
  },
  resolve: {
    alias: [
      {
        find: "@modorix-ui",
        replacement: path.resolve(__dirname, "../../packages/ui/src")
      },
      {
        find: "@modorix-commons",
        replacement: path.resolve(__dirname, "../../packages/modorix-commons/src")
      }
    ]
  },
  plugins: [
    react(),
    webExtension({
      manifest: generateManifest,
      additionalInputs: ["src/scripts/block-user.ts"],
      disableAutoLaunch: true,
      watchFilePaths: ["src", "public"],
      browser: process.env.TARGET || "chrome"
    })
  ]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9mYWJpZW4vZGV2L21vZG9yaXgvYXBwcy9tb2Rvcml4LWV4dGVuc2lvblwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL2hvbWUvZmFiaWVuL2Rldi9tb2Rvcml4L2FwcHMvbW9kb3JpeC1leHRlbnNpb24vdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL2hvbWUvZmFiaWVuL2Rldi9tb2Rvcml4L2FwcHMvbW9kb3JpeC1leHRlbnNpb24vdml0ZS5jb25maWcudHNcIjtpbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnO1xuaW1wb3J0IHBhdGgsIHsgZGlybmFtZSB9IGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgZmlsZVVSTFRvUGF0aCB9IGZyb20gJ3VybCc7XG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCB3ZWJFeHRlbnNpb24sIHsgcmVhZEpzb25GaWxlIH0gZnJvbSAndml0ZS1wbHVnaW4td2ViLWV4dGVuc2lvbic7XG5cbmNvbnN0IF9fZmlsZW5hbWUgPSBmaWxlVVJMVG9QYXRoKGltcG9ydC5tZXRhLnVybCk7XG5jb25zdCBfX2Rpcm5hbWUgPSBkaXJuYW1lKF9fZmlsZW5hbWUpO1xuXG5mdW5jdGlvbiBnZW5lcmF0ZU1hbmlmZXN0KCkge1xuICBjb25zdCBtYW5pZmVzdCA9IHJlYWRKc29uRmlsZSgnc3JjL21hbmlmZXN0Lmpzb24nKTtcbiAgY29uc3QgcGtnID0gcmVhZEpzb25GaWxlKCdwYWNrYWdlLmpzb24nKTtcbiAgcmV0dXJuIHtcbiAgICBuYW1lOiBwa2cubmFtZSxcbiAgICBkZXNjcmlwdGlvbjogcGtnLmRlc2NyaXB0aW9uLFxuICAgIHZlcnNpb246IHBrZy52ZXJzaW9uLFxuICAgIC4uLm1hbmlmZXN0LFxuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBidWlsZDoge1xuICAgIG91dERpcjogcHJvY2Vzcy5lbnYuVEFSR0VUID09PSAnZmlyZWZveCcgPyAnZGlzdC9maXJlZm94JyA6ICdkaXN0L2Nocm9tZScsXG4gIH0sXG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczogW1xuICAgICAge1xuICAgICAgICBmaW5kOiAnQG1vZG9yaXgtdWknLFxuICAgICAgICByZXBsYWNlbWVudDogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4uLy4uL3BhY2thZ2VzL3VpL3NyYycpLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgZmluZDogJ0Btb2Rvcml4LWNvbW1vbnMnLFxuICAgICAgICByZXBsYWNlbWVudDogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4uLy4uL3BhY2thZ2VzL21vZG9yaXgtY29tbW9ucy9zcmMnKSxcbiAgICAgIH0sXG4gICAgXSxcbiAgfSxcbiAgcGx1Z2luczogW1xuICAgIHJlYWN0KCksXG4gICAgd2ViRXh0ZW5zaW9uKHtcbiAgICAgIG1hbmlmZXN0OiBnZW5lcmF0ZU1hbmlmZXN0LFxuICAgICAgYWRkaXRpb25hbElucHV0czogWydzcmMvc2NyaXB0cy9ibG9jay11c2VyLnRzJ10sXG4gICAgICBkaXNhYmxlQXV0b0xhdW5jaDogdHJ1ZSxcbiAgICAgIHdhdGNoRmlsZVBhdGhzOiBbJ3NyYycsICdwdWJsaWMnXSxcbiAgICAgIGJyb3dzZXI6IHByb2Nlc3MuZW52LlRBUkdFVCB8fCAnY2hyb21lJyxcbiAgICB9KSxcbiAgXSxcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUErVCxPQUFPLFdBQVc7QUFDalYsT0FBTyxRQUFRLGVBQWU7QUFDOUIsU0FBUyxxQkFBcUI7QUFDOUIsU0FBUyxvQkFBb0I7QUFDN0IsT0FBTyxnQkFBZ0Isb0JBQW9CO0FBSjJKLElBQU0sMkNBQTJDO0FBTXZQLElBQU0sYUFBYSxjQUFjLHdDQUFlO0FBQ2hELElBQU0sWUFBWSxRQUFRLFVBQVU7QUFFcEMsU0FBUyxtQkFBbUI7QUFDMUIsUUFBTSxXQUFXLGFBQWEsbUJBQW1CO0FBQ2pELFFBQU0sTUFBTSxhQUFhLGNBQWM7QUFDdkMsU0FBTztBQUFBLElBQ0wsTUFBTSxJQUFJO0FBQUEsSUFDVixhQUFhLElBQUk7QUFBQSxJQUNqQixTQUFTLElBQUk7QUFBQSxJQUNiLEdBQUc7QUFBQSxFQUNMO0FBQ0Y7QUFFQSxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixPQUFPO0FBQUEsSUFDTCxRQUFRLFFBQVEsSUFBSSxXQUFXLFlBQVksaUJBQWlCO0FBQUEsRUFDOUQ7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMO0FBQUEsUUFDRSxNQUFNO0FBQUEsUUFDTixhQUFhLEtBQUssUUFBUSxXQUFXLHVCQUF1QjtBQUFBLE1BQzlEO0FBQUEsTUFDQTtBQUFBLFFBQ0UsTUFBTTtBQUFBLFFBQ04sYUFBYSxLQUFLLFFBQVEsV0FBVyxvQ0FBb0M7QUFBQSxNQUMzRTtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTixhQUFhO0FBQUEsTUFDWCxVQUFVO0FBQUEsTUFDVixrQkFBa0IsQ0FBQywyQkFBMkI7QUFBQSxNQUM5QyxtQkFBbUI7QUFBQSxNQUNuQixnQkFBZ0IsQ0FBQyxPQUFPLFFBQVE7QUFBQSxNQUNoQyxTQUFTLFFBQVEsSUFBSSxVQUFVO0FBQUEsSUFDakMsQ0FBQztBQUFBLEVBQ0g7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
