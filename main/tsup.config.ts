import { defineConfig } from "tsup";

export default defineConfig({
    noExternal: [/^(?!electron|sharp)/],
    external: ["electron"],
});
