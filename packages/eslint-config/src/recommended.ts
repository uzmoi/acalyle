import eslint from "@eslint/js";
import type { ESLint, Linter } from "eslint";
import pureModule from "eslint-plugin-pure-module";
import unicornPlugin from "eslint-plugin-unicorn";
import { acalylePlugin } from "./acalyle";
import { ERROR, WARN, warn } from "./util";

export const recommended: Linter.Config[] = [
  {
    ...unicornPlugin.configs["flat/recommended"],
    plugins: {
      ...unicornPlugin.configs["flat/recommended"].plugins,
      acalyle: acalylePlugin,
    },
    rules: {
      ...eslint.configs.recommended.rules,
      "acalyle/prefer-string-literal": WARN,
      "unicorn/better-regex": WARN,
      "unicorn/consistent-destructuring": WARN,
      "unicorn/custom-error-definition": WARN,
      "unicorn/expiring-todo-comments": warn({
        terms: ["todo", "fixme"],
        allowWarningComments: false,
      }),
      // TODO[eslint-plugin-unicorn@>=57]: ルール追加
      // "unicorn/no-accessor-recursion": WARN,
      "unicorn/no-array-method-this-argument": WARN,
      "unicorn/no-array-push-push": WARN,
      // "unicorn/no-instanceof-builtins": WARN,
      "unicorn/no-keyword-prefix": WARN,
      // "unicorn/no-named-default": WARN,
      "unicorn/no-negated-condition": WARN,
      "unicorn/no-unnecessary-polyfills": WARN,
      "unicorn/no-unsafe-regex": ERROR,
      "unicorn/no-unused-properties": WARN,
      "unicorn/prefer-array-find": WARN,
      "unicorn/prefer-array-index-of": WARN,
      "unicorn/prefer-default-parameters": WARN,
      "unicorn/prefer-export-from": WARN,
      "unicorn/prefer-json-parse-buffer": WARN,
      "unicorn/prefer-keyboard-event-key": WARN,
      "unicorn/prefer-number-properties": warn({ checkInfinity: false }),
      "unicorn/prefer-object-from-entries": WARN,
      "unicorn/prefer-switch": WARN,
      "unicorn/prefer-ternary": WARN,
      "unicorn/prefer-top-level-await": WARN,
      "unicorn/relative-url-style": WARN,
      "unicorn/template-indent": warn({
        indent: 2,
        tags: [],
        selectors: ["TaggedTemplateExpression"],
      }),
    },
  },
  {
    files: ["**/src/**"],
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
