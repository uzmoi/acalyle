import { tagResolver } from "@acalyle/css/tag-resolver";
import nitrogql from "@nitrogql/rollup-plugin";
import react from "@vitejs/plugin-react-swc";
import wywInJS from "@wyw-in-js/vite";
import dts from "vite-plugin-dts";
import { coverageConfigDefaults, defineConfig } from "vitest/config";

const isStorybook = process.argv[1]?.endsWith("storybook");

export default defineConfig({
    plugins: [
        react(),
        (wywInJS as unknown as typeof import("@wyw-in-js/vite").default)({
            include: ["**/*.{ts,tsx}"],
            babelOptions: { presets: ["@babel/preset-typescript"] },
            sourceMap: true,
            tagResolver,
        }),
        nitrogql({ include: ["**/*.graphql"] }),
        !isStorybook &&
            dts({
                exclude: "**/*.css.ts",
                tsconfigPath: "tsconfig.main.json",
                rollupTypes: true,
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
    test: {
        coverage: {
            include: ["src/**"],
            exclude: [
                ...coverageConfigDefaults.exclude,
                "**/__{generated,mocks}__/**",
                "**/*.stories.tsx",
            ],
        },
    },
});
