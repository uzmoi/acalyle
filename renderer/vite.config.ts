import linaria from "@linaria/vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
import htmlMinifier from "vite-plugin-html-minifier";
import relay from "vite-plugin-relay";
import { defineConfig } from "vitest/config";
import { htmlReplace } from "./vite-plugin-html-replace";

// https://vitejs.dev/config/
export default defineConfig(env => ({
    root: __dirname,
    base: "./",
    define: {
        "import.meta.vitest": false,
    },
    resolve: {
        alias: { "~/": `${__dirname}/src/` },
    },
    plugins: [
        react(),
        linaria({
            include: ["**/*.(ts|tsx)"],
            sourceMap: env.mode === "develepment",
            babelOptions: {
                presets: ["@babel/preset-typescript"],
            },
        }),
        relay,
        htmlReplace({
            mode: env.mode,
        }),
        htmlMinifier(),
    ],
    build: {
        minify: "terser",
        modulePreload: { polyfill: false },
        outDir: "../app",
        assetsDir: "",
        emptyOutDir: false,
        sourcemap: env.mode === "develepment",
        rollupOptions: {
            plugins: [visualizer({ gzipSize: true, brotliSize: true })],
            output: {
                manualChunks: {
                    relay: ["react-relay", "relay-runtime"],
                    "react-markdown": ["react-markdown"],
                },
            },
        },
    },
    test: {
        globals: true,
        environment: "happy-dom",
        includeSource: ["src/**/*.{ts,tsx}"],
        setupFiles: ["@testing-library/jest-dom"],
    },
}));
