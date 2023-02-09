import { defineConfig } from "vite";
import "vitest";

export default defineConfig({
    build: {
        rollupOptions: { input: "./src/index.ts" },
    },
    test: {
        includeSource: ["src/*.{ts,tsx}"],
    },
});
