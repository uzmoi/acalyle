import { ESLint, Linter } from "eslint";
import unicornPlugin from "eslint-plugin-unicorn";
import { typescriptFiles } from "./typescript";
import { ERROR, OFF, WARN, replaceWarn, warn } from "./util";

export const unicorn: Linter.FlatConfig = {
    files: [typescriptFiles],
    plugins: { unicorn: unicornPlugin },
    rules: {
        ...replaceWarn(
            (unicornPlugin.configs?.recommended as ESLint.ConfigData).rules!,
        ),
        "unicorn/filename-case": warn({
            cases: { kebabCase: true, pascalCase: true },
        }),
        "unicorn/import-style": OFF,
        "unicorn/no-array-callback-reference": OFF,
        "unicorn/no-array-reduce": OFF,
        "unicorn/no-for-loop": OFF,
        "unicorn/no-nested-ternary": OFF,
        "unicorn/no-null": OFF,
        "unicorn/no-this-assignment": OFF,
        "unicorn/no-unsafe-regex": ERROR,
        "unicorn/no-unused-properties": WARN,
        "unicorn/prefer-at": OFF,
        "unicorn/prefer-code-point": OFF,
        "unicorn/prefer-module": OFF,
        "unicorn/prefer-number-properties": warn({ checkInfinity: false }),
        "unicorn/prefer-query-selector": OFF,
        "unicorn/prefer-string-replace-all": OFF,
        "unicorn/prevent-abbreviations": OFF,
        "unicorn/template-indent": warn({
            indent: 4,
            tags: [],
            selectors: ["TaggedTemplateExpression"],
        }),
    },
};
