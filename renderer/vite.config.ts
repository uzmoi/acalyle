import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import linaria from "@linaria/rollup";
import relay from "vite-plugin-relay";

// https://vitejs.dev/config/
export default defineConfig({
    root: __dirname,
    base: "./",
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
});
