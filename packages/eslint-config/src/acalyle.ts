import { ESLint, Linter } from "eslint";
import { rules } from "./rules";
import { typescriptFiles } from "./typescript";
import { warn } from "./util";

export const acalylePlugin: ESLint.Plugin = { rules };

export const acalyleConfig: Linter.FlatConfig = {
    files: [typescriptFiles],
    ignores: [
        "**/*[-.]{test,spec,config}.*",
        "**/{test,spec}?(s)/**",
        "**/__{test,spec}?(s)__/**",
    ],
    plugins: { acalyle: acalylePlugin },
    rules: {
        "acalyle/no-module-side-effect": warn({
            pureFunctions: ["import.meta.hot.*"],
        }),
    },
};
