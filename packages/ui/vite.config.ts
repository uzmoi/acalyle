import { tagResolver } from "@acalyle/css/tag-resolver";
import react from "@vitejs/plugin-react-swc";
import wywInJS from "@wyw-in-js/vite";
import dts from "vite-plugin-dts";
import { coverageConfigDefaults, defineConfig } from "vitest/config";
import { dependencies } from "./package.json";

const isStorybook = process.argv[1]?.includes("storybook");

export default defineConfig({
    plugins: [
        react(),
        (wywInJS as unknown as typeof import("@wyw-in-js/vite").default)({
            include: ["**/*.{ts,tsx}"],
            babelOptions: { presets: ["@babel/preset-typescript"] },
            sourceMap: true,
            tagResolver,
            classNameSlug: (hash, title, { name }) =>
                `${title === "className" ? name : title}__${hash}`,
        }),
        !isStorybook &&
            dts({ tsconfigPath: "tsconfig.main.json", rollupTypes: true }),
    ],
    build: {
        target: "esnext",
        sourcemap: true,
        minify: false,
        lib: {
            entry: "./src/index.ts",
            fileName: "index",
            cssFileName: "style",
            formats: ["es"],
        },
        rollupOptions: {
            external: [/^react(?![^/])/, ...Object.keys(dependencies)],
        },
    },
    test: {
        environment: "happy-dom",
        coverage: {
            include: ["src/**"],
            exclude: [...coverageConfigDefaults.exclude, "**/*.stories.tsx"],
        },
    },
});
