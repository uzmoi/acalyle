import { macaronVitePlugin } from "@macaron-css/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig, splitVendorChunkPlugin } from "vite";

// const mobile =
//   process.env.TAURI_PLATFORM === "android" ||
//   process.env.TAURI_PLATFORM === "ios";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), macaronVitePlugin(), splitVendorChunkPlugin()],
  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
  },
  envPrefix: ["VITE_", "TAURI_"],
  build: {
    target: process.env.TAURI_PLATFORM == "windows" ? "chrome105" : "safari13",
    minify: !process.env.TAURI_DEBUG,
    sourcemap: !!process.env.TAURI_DEBUG,
  },
});
