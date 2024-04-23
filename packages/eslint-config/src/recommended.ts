import eslint from "@eslint/js";
import type { ESLint, Linter } from "eslint";
import perfectionist from "eslint-plugin-perfectionist";
import unicornPlugin from "eslint-plugin-unicorn";
import { ERROR, OFF, WARN, replaceWarn, unPartial, warn } from "./util";

export const recommended: Linter.FlatConfig = {
    plugins: {
        unicorn: unicornPlugin,
        perfectionist,
    },
    rules: {
        ...eslint.configs.recommended.rules,
        ...replaceWarn(
            unPartial(
                (unicornPlugin.configs?.recommended as ESLint.ConfigData)
                    .rules!,
            ),
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
        ...replaceWarn(
            unPartial(
                (
                    perfectionist.configs?.[
                        "recommended-natural"
                    ] as ESLint.ConfigData
                ).rules!,
            ),
        ),
        "perfectionist/sort-imports": OFF,
        "perfectionist/sort-interfaces": OFF,
        "perfectionist/sort-classes": OFF,
        "perfectionist/sort-jsx-props": OFF,
        "perfectionist/sort-object-types": OFF,
        "perfectionist/sort-objects": OFF,
        "perfectionist/sort-union-types": OFF,
    },
};
