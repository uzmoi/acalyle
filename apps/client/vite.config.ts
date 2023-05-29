import { macaronVitePlugin } from "@macaron-css/vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import graphqlCodegen from "vite-plugin-graphql-codegen";
import restart from "vite-plugin-restart";
import { defineConfig } from "vitest/config";
import { dependencies } from "./package.json";

const monorepoPackages = Object.keys(dependencies)
    .filter(dep => dep.startsWith("@acalyle/"))
    .map(dep => dep.replace("@acalyle/", ""));

export default defineConfig({
    plugins: [
        react(),
        macaronVitePlugin(),
        dts({
            exclude: "**/*.css.ts",
            insertTypesEntry: true,
        }),
        graphqlCodegen({
            configFilePathOverride: `${process.cwd()}/codegen.ts`,
        }),
        restart({
            restart: [
                `../../packages/{${monorepoPackages.join(",")}}/dist/**/*.js`,
            ],
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
