import { tagResolver } from "@acalyle/css/tag-resolver";
import react from "@vitejs/plugin-react-swc";
import wywInJS from "@wyw-in-js/vite";
import dts from "vite-plugin-dts";
import { coverageConfigDefaults, defineConfig } from "vitest/config";
import packageJson from "./package.json" with { type: "json" };

const isStorybook = process.argv[1]?.includes("storybook");

type WyWinJS = typeof import("@wyw-in-js/vite").default;

export default defineConfig({
  plugins: [
    react(),
    (wywInJS as unknown as WyWinJS)({
      include: ["**/*.{ts,tsx}"],
      babelOptions: {
        presets: ["@babel/preset-typescript"],
        plugins: ["transform-vite-meta-env"],
      },
      sourceMap: true,
      tagResolver,
      features: {
        dangerousCodeRemover: ["**/*", "!**/src/theme/*"],
      } as NonNullable<Parameters<WyWinJS>[0]>["features"],
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
      external: [/^react(?![^/])/, ...Object.keys(packageJson.dependencies)],
    },
  },
  test: {
    environment: "happy-dom",
    setupFiles: ["@testing-library/jest-dom/vitest", "vitest.setup.ts"],
    coverage: {
      include: ["src/**"],
      exclude: [...coverageConfigDefaults.exclude, "**/*.stories.tsx"],
    },
  },
});
