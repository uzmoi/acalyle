import { defineConfig } from "tsup";

export default defineConfig({
    entry: ["src/index.ts", "src/tag-resolver.ts", "src/processors/*.ts"],
    format: "esm",
    sourcemap: true,
    dts: true,
});
