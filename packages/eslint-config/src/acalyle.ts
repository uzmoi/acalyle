import { ESLint, Linter } from "eslint";
import pureModule from "eslint-plugin-pure-module";
import { rules } from "./rules";
import { typescriptFiles } from "./typescript";
import { WARN, warn } from "./util";

export const acalylePlugin: ESLint.Plugin = { rules };

export const acalyleConfig: Linter.FlatConfig[] = [
    {
        files: [typescriptFiles],
        plugins: {
            acalyle: acalylePlugin,
            "pure-module": pureModule as unknown as ESLint.Plugin,
        },
        rules: {
            "acalyle/prefer-string-literal": WARN,
        },
    },
    {
        files: [typescriptFiles.replace("**", "**/src/**")],
        ignores: [
            "**/*[-.]{test,spec,config}.*",
            "**/*[-.]{test,spec}-d.*",
            "**/{test,spec}?(s)/**",
            "**/__{test,spec}?(s)__/**",
        ],
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
