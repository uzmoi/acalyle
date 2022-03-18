import type {} from "vitest";
import linaria from "@linaria/rollup";
import react from "@vitejs/plugin-react";
// eslint-disable-next-line import/no-extraneous-dependencies
import { defineConfig } from "vite";
import relay from "vite-plugin-relay";

// https://vitejs.dev/config/
export default defineConfig({
    root: __dirname,
    base: "./",
    define: {
        "import.meta.vitest": false,
    },
    plugins: [
        react(),
        linaria({
            include: ["**/*.(ts|tsx)"],
            sourceMap: true,
        }),
        relay,
    ],
    build: {
        minify: "terser",
        polyfillModulePreload: false,
        outDir: "../app",
        assetsDir: "",
        emptyOutDir: false,
    },
    test: {
        globals: true,
        environment: "happy-dom",
        includeSource: ["src/**/*.{ts,tsx}"],
        setupFiles: ["setup-test.ts"],
    },
});
