import { codecovVitePlugin as codecov } from "@codecov/vite-plugin";
import nitrogql from "@nitrogql/rollup-plugin";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import wywInJS from "@wyw-in-js/vite";
import unocss from "unocss/vite";
import dts from "unplugin-dts/vite";
import { defineConfig } from "vitest/config";

const isStorybook = process.argv[1]?.includes("storybook");

export default defineConfig(({ command }) => ({
  plugins: [
    tanstackRouter(),
    react(),
    unocss(),
    wywInJS({
      include: ["**/*.{ts,tsx}"],
      sourceMap: true,
      classNameSlug: (hash, title, { name }) =>
        `${title === "className" ? name : title}__${hash}`,
      importOverrides: {
        "@emotion/hash": { unknown: "allow" },
        react: { unknown: "allow" },
      },
    }),
    nitrogql({ include: ["**/*.graphql"] }),
    command === "build" &&
      !isStorybook &&
      dts({
        tsconfigPath: "tsconfig.main.json",
        bundleTypes: true,
      }),
    command === "build" &&
      codecov({
        enableBundleAnalysis: !!process.env.CI,
        bundleName: "@acalyle/client",
        oidc: { useGitHubOIDC: true },
      }),
  ],
  resolve: {
    tsconfigPaths: true,
  },
  build: {
    lib: {
      entry: "src/index.ts",
      fileName: "index",
      cssFileName: "style",
      formats: ["es"],
    },
    rolldownOptions: {
      external: [/^react/, /^react-dom/, /^@acalyle\/(?!ui\/dist\/style\.css)/],
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
    reporters: [["junit", { outputFile: "coverage/test-report.junit.xml" }]],
    environment: "happy-dom",
    setupFiles: ["@testing-library/jest-dom/vitest", "vitest.setup.ts"],
    coverage: {
      include: ["src/**"],
      exclude: [
        "**/dev/**",
        "**/*.gen.*",
        "**/*.stories.*",
        "**/*.d.ts",
        "**/*.d.*.ts",
        "**/*.map",
      ],
    },
  },
}));
