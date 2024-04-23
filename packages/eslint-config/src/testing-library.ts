import { ESLint, Linter } from "eslint";
import eslintPluginTestingLibrary from "eslint-plugin-testing-library";
import { tsExts, unPartial } from "./util";

// cspell:word marko
type Lib = "dom" | "angular" | "react" | "vue" | "marko";

export const testingLibrary = (lib: Lib): Linter.FlatConfig => ({
    files: [`**/*.test.${tsExts}`],
    plugins: { "testing-library": eslintPluginTestingLibrary },
    rules: {
        ...unPartial(
            (eslintPluginTestingLibrary.configs?.[lib] as ESLint.ConfigData)
                .rules!,
        ),
    },
});
