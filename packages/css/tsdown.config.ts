import { defineConfig } from "tsdown";

export default defineConfig([
  {
    entry: ["src/index.ts", "src/tag-resolver.ts"],
    format: "esm",
    sourcemap: true,
    dts: true,
    clean: true,
  },
  {
    entry: ["src/processors/*.ts"],
    outDir: "dist/processors",
    target: "esnext",
  },
]);
