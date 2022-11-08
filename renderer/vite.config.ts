import type {} from "vitest";
import linaria from "@linaria/rollup";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vite";
import relay from "vite-plugin-relay";
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
                plugins: [
                    ["module-resolver", { alias: { "~": `${__dirname}/src` } }],
                ],
            },
        }),
        relay,
        htmlReplace({
            mode: env.mode,
        }),
    ],
    build: {
        minify: "terser",
        polyfillModulePreload: false,
        outDir: "../app",
        assetsDir: "",
        emptyOutDir: false,
        sourcemap: env.mode === "develepment",
        rollupOptions: {
            plugins: [visualizer({ gzipSize: true, brotliSize: true })],
            output: {
                manualChunks: {
                    recoil: ["recoil"],
                    relay: ["react-relay", "relay-runtime"],
                    "react-markdown": ["react-markdown"],
                    "react-syntax-highlighter": ["react-syntax-highlighter"],
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
