import { ESLint, Linter } from "eslint";
import { rules } from "./rules";
import { typescriptFiles } from "./typescript";
import { WARN, warn } from "./util";

export const acalylePlugin: ESLint.Plugin = { rules };

export const acalyleConfig: Linter.FlatConfig[] = [
    {
        files: [typescriptFiles],
        plugins: { acalyle: acalylePlugin },
        rules: {
            "acalyle/prefer-string-literal": WARN,
        },
    },
    {
        files: [typescriptFiles.replace("**", "**/src/**")],
        ignores: [
            "**/*[-.]{test,spec,config}.*",
            "**/{test,spec}?(s)/**",
            "**/__{test,spec}?(s)__/**",
        ],
        rules: {
            "acalyle/no-module-side-effect": warn({
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
