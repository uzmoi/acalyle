import { type Extractor, defineConfig, transformerCompileClass } from "unocss";

const extractor: Extractor = {
  name: "@acalyle/extractor-compile-class",
  extract({ code }) {
    // 開発時にエディタがクラスを検出するため
    const rawUnoCompileClasses =
      code
        .match(/:uno-?[^\s:]*:(?:\s+[^\s"';`{}]+)+/g)
        ?.flatMap(x => x.split(" "))
        .filter(x => x !== "" && !x.startsWith(":uno")) ?? [];

    // cssの抽出時はtransformerCompileClassが先に適用される
    const compiledClasses = code.match(/uno-[\w-]+/g) ?? [];

    return [...rawUnoCompileClasses, ...compiledClasses];
  },
};

export default defineConfig({
  extractorDefault: extractor,
  transformers: [transformerCompileClass()],
});
