import { macaronVitePlugin } from "@macaron-css/vite";
import nitrogql from "@nitrogql/rollup-plugin";
import react from "@vitejs/plugin-react-swc";
import dts from "vite-plugin-dts";
import { defineConfig } from "vitest/config";

export default defineConfig({
    plugins: [
        react(),
        macaronVitePlugin(),
        nitrogql({ include: ["**/*.graphql"] }),
        dts({
            exclude: "**/*.css.ts",
            insertTypesEntry: true,
        }),
    ],
    resolve: {
        alias: { "~/": `${__dirname}/src/` },
    },
    build: {
        lib: {
            entry: "./src/index.ts",
            fileName: "index",
            formats: ["es"],
        },
        rollupOptions: {
            external: [/^react/, /^react-dom/, /^@acalyle\//],
        },
    },
    server: {
        proxy: {
            "/api": {
                target: "http://localhost:4323/",
                rewrite: path => `${path.replace(/^\/api/, "")}?endpoint=/api`,
            },
        },
    },
});
