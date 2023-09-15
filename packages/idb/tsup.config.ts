import { defineConfig } from "tsup";

export default defineConfig({
    entry: ["src/index.ts"],
    format: "esm",
    minifySyntax: true,
    esbuildOptions(options) {
        options.mangleProps = /^_[^_]/;
    },
    sourcemap: true,
    dts: true,
});
