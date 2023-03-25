import { defineConfig } from "vitest/config";
import { dependencies } from "./package.json";

export default defineConfig({
    build: {
        sourcemap: true,
        lib: {
            entry: "./src/index.ts",
            fileName: "index",
            formats: ["es"],
        },
        rollupOptions: {
            external: Object.keys(dependencies),
        },
    },
});
