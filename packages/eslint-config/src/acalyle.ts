import { ESLint, Linter } from "eslint";
import pureModule from "eslint-plugin-pure-module";
import { rules } from "./rules";
import { WARN, tsExts } from "./util";

export const acalylePlugin: ESLint.Plugin = { rules };

export const acalyleConfig: Linter.FlatConfig[] = [
    {
        files: [`**/*.${tsExts}`],
        plugins: {
            acalyle: acalylePlugin,
            "pure-module": pureModule as unknown as ESLint.Plugin,
        },
        rules: {
            "acalyle/prefer-string-literal": WARN,
        },
    },
    {
        files: [`**/src/**/*.${tsExts}`],
        ignores: ["**/*.{test,test-d,stories}.*"],
        rules: {
            "pure-module/pure-module": warn({
                pureFunctions: [
                    // vite
                    "import.meta.hot.*",
                    // zero-runtime css-in-js
                    "style",
                    "styled",
                    "styled.*",
                    "css",
                ],
            }),
        },
    },
];
