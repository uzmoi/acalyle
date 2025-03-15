import { tagResolver } from "@acalyle/css/tag-resolver";
import nitrogql from "@nitrogql/rollup-plugin";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react-swc";
import wywInJS from "@wyw-in-js/vite";
import unocss from "unocss/vite";
import dts from "vite-plugin-dts";
import { coverageConfigDefaults, defineConfig } from "vitest/config";

const isStorybook = process.argv[1]?.includes("storybook");

type WyWinJS = typeof import("@wyw-in-js/vite").default;

export default defineConfig({
  plugins: [
    TanStackRouterVite(),
    react(),
    unocss(),
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
    environment: "happy-dom",
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
