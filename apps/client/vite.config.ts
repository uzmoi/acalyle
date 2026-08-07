import { codecovVitePlugin } from "@codecov/vite-plugin";
import nitrogql from "@nitrogql/rollup-plugin";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import wywInJS from "@wyw-in-js/vite";
import unocss from "unocss/vite";
import { dts } from "rolldown-plugin-dts";
import { coverageConfigDefaults, defineConfig } from "vitest/config";

const isStorybook = process.argv[1]?.includes("storybook");

export default defineConfig({
  plugins: [
    tanstackRouter(),
    react(),
    unocss(),
    wywInJS({
      include: ["**/*.{ts,tsx}"],
      sourceMap: true,
      classNameSlug: (hash, title, { name }) =>
        `${title === "className" ? name : title}__${hash}`,
    }),
    nitrogql({ include: ["**/*.graphql"] }),
    !isStorybook && dts({ tsconfig: "tsconfig.main.json" }),
    codecovVitePlugin({
      enableBundleAnalysis: process.env.CODECOV_TOKEN !== undefined,
      bundleName: "@acalyle/client",
      uploadToken: process.env.CODECOV_TOKEN,
    }),
  ],
  resolve: {
    alias: { "~/": `${__dirname}/src/` },
  },
  build: {
    lib: {
      entry: "./src/index.ts",
      fileName: "index",
      cssFileName: "style",
      formats: ["es"],
    },
    rollupOptions: {
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
        ...coverageConfigDefaults.exclude,
        "**/__{generated,mocks}__/**",
        "**/*.stories.tsx",
      ],
    },
  },
});
