import { tagResolver } from "@acalyle/css/tag-resolver";
import nitrogql from "@nitrogql/rollup-plugin";
import react from "@vitejs/plugin-react-swc";
import wywInJS from "@wyw-in-js/vite";
import dts from "vite-plugin-dts";
import { coverageConfigDefaults, defineConfig } from "vitest/config";

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
        nitrogql({ include: ["**/*.graphql"] }),
        !isStorybook &&
            dts({ tsconfigPath: "tsconfig.main.json", rollupTypes: true }),
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
            external: [
                /^react/,
                /^react-dom/,
                /^@acalyle\/(?!ui\/dist\/style\.css)/,
            ],
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
