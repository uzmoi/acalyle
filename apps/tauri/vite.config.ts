import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// const mobile =
//     process.env.TAURI_PLATFORM === "android" ||
//     process.env.TAURI_PLATFORM === "ios";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    clearScreen: false,
    server: {
        port: 1420,
        strictPort: true,
    },
    envPrefix: ["VITE_", "TAURI_"],
    build: {
        target:
            process.env.TAURI_PLATFORM == "windows" ? "chrome105" : "safari13",
        minify: !process.env.TAURI_DEBUG,
        sourcemap: !!process.env.TAURI_DEBUG,
    },
});
