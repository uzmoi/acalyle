import {
    type Extractor,
    defineConfig,
    presetMini,
    transformerCompileClass,
} from "unocss";

const extractor: Extractor = {
    name: "@acalyle/extractor-compile-class",
    extract({ code }) {
        return code.match(/uno-[\w-]+/g) ?? [];
    },
};

export default defineConfig({
    presets: [presetMini()],
    extractorDefault: extractor,
    transformers: [transformerCompileClass()],
});
