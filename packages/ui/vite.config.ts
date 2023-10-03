import { macaronVitePlugin } from "@macaron-css/vite";
import react from "@vitejs/plugin-react-swc";
import dts from "vite-plugin-dts";
import { defineConfig } from "vitest/config";
import { dependencies } from "./package.json";

export default defineConfig({
    plugins: [react(), macaronVitePlugin(), dts({ exclude: "**/*.css.ts" })],
    build: {
        target: "esnext",
        sourcemap: true,
        minify: false,
        lib: {
            entry: "./src/index.ts",
            fileName: "index",
            formats: ["es"],
        },
        rollupOptions: {
            external: [/^react(?![^/])/, ...Object.keys(dependencies)],
        },
    },
    test: {
        environment: "happy-dom",
    },
});
