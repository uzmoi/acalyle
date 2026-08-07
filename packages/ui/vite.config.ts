import react from "@vitejs/plugin-react";
import wywInJS from "@wyw-in-js/vite";
import { dts } from "rolldown-plugin-dts";
import { coverageConfigDefaults, defineConfig } from "vitest/config";
import packageJson from "./package.json" with { type: "json" };

export default defineConfig({
  plugins: [
    react(),
    wywInJS({
      include: ["**/*.{ts,tsx}"],
      sourceMap: true,
      classNameSlug: (hash, title, { name }) =>
        `${title === "className" ? name : title}__${hash}`,
    }),
    dts({ tsconfig: "tsconfig.main.json" }),
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
