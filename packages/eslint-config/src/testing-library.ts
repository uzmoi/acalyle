import { ESLint, Linter } from "eslint";
import eslintPluginTestingLibrary from "eslint-plugin-testing-library";

type Lib = "dom" | "angular" | "react" | "vue" | "marko";

export const testingLibrary = (lib: Lib): Linter.FlatConfig => ({
    files: ["**/*.{ts,mts,cts,tsx,mtx,ctx}".replace("/*", "/*.{test,spec}")],
    plugins: { "testing-library": eslintPluginTestingLibrary },
    rules: {
        ...((eslintPluginTestingLibrary.configs?.[lib] as ESLint.ConfigData)
            .rules as Linter.RulesRecord),
    },
});
