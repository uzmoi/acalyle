import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import linaria from "@linaria/rollup";

// https://vitejs.dev/config/
export default defineConfig({
    root: __dirname,
    base: "./",
    plugins: [
        react(),
        linaria({ include: ["**/*.tsx"] }),
    ],
    build: {
        outDir: "../app",
        polyfillModulePreload: false,
    },
});
