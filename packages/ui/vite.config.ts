import { macaronVitePlugin } from "@macaron-css/vite";
import { defineConfig } from "vitest/config";

export default defineConfig({
    plugins: [macaronVitePlugin()],
    build: {
        lib: {
            entry: "./src/index.ts",
            fileName: "index",
            formats: ["es"],
        },
    },
});
