import eslint from "@eslint/js";
import type { ESLint, Linter } from "eslint";
import perfectionist from "eslint-plugin-perfectionist";
import pureModule from "eslint-plugin-pure-module";
import unicornPlugin from "eslint-plugin-unicorn";
import {
  ERROR,
  WARN,
  extendsRules,
  omit,
  replaceWarn,
  tsExts,
  warn,
} from "./util";

export const recommended: Linter.FlatConfig[] = [
  {
    ...unicornPlugin.configs["flat/recommended"],
    rules: omit(replaceWarn(unicornPlugin.configs["flat/recommended"].rules!), [
      "unicorn/import-style",
      "unicorn/no-array-callback-reference",
      "unicorn/no-array-reduce",
      "unicorn/no-for-loop",
      "unicorn/no-invalid-fetch-options",
      "unicorn/no-length-as-slice-end",
      "unicorn/no-magic-array-flat-depth",
      "unicorn/no-nested-ternary",
      "unicorn/no-null",
      "unicorn/no-this-assignment",
      "unicorn/prefer-at",
      "unicorn/prefer-code-point",
      "unicorn/prefer-global-this",
      "unicorn/prefer-math-min-max",
      "unicorn/prefer-module",
      "unicorn/prefer-query-selector",
      "unicorn/prefer-string-raw",
      "unicorn/prefer-string-replace-all",
      "unicorn/prefer-structured-clone",
      "unicorn/prevent-abbreviations",
    ]),
  },
  {
    plugins: {
      perfectionist,
    },
    rules: {
      ...eslint.configs.recommended.rules,
      "unicorn/consistent-destructuring": WARN,
      "unicorn/no-unsafe-regex": ERROR,
      "unicorn/no-unused-properties": WARN,
      "unicorn/prefer-number-properties": warn({ checkInfinity: false }),
      "unicorn/template-indent": warn({
        indent: 2,
        tags: [],
        selectors: ["TaggedTemplateExpression"],
      }),
      ...omit(
        extendsRules(perfectionist, ["recommended-natural"], { warn: true }),
        [
          "perfectionist/sort-imports",
          "perfectionist/sort-interfaces",
          "perfectionist/sort-classes",
          "perfectionist/sort-jsx-props",
          "perfectionist/sort-object-types",
          "perfectionist/sort-objects",
          "perfectionist/sort-intersection-types",
          "perfectionist/sort-union-types",
        ],
      ),
    },
  },
  {
    files: [`**/src/**/*.${tsExts}`],
    ignores: ["**/*.{test,test-d,stories}.*"],
    plugins: {
      "pure-module": pureModule as unknown as ESLint.Plugin,
    },
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
