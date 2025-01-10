import { defineConfig, presetMini, transformerCompileClass } from "unocss";

export default defineConfig({
    presets: [presetMini()],
    transformers: [transformerCompileClass()],
});
