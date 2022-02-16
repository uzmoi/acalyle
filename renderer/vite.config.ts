import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
    root: __dirname,
    base: "./",
    plugins: [react()],
    build: {
        outDir: "../app",
        polyfillModulePreload: false,
    },
});
