import type { ESLint, Linter } from "eslint";
import importPlugin from "eslint-plugin-import";
import importAccess from "eslint-plugin-import-access/flat-config";
import { ERROR, OFF, WARN, error, never, warn } from "./util";

export const importConfig: Linter.Config[] = [
  importPlugin.flatConfigs.typescript,
  {
    plugins: {
      ...importPlugin.flatConfigs.recommended.plugins,
      "import-access": importAccess as ESLint.Plugin,
    },
    settings: {
      "import/resolver": "typescript",
    },
    rules: {
      "sort-imports": OFF,
      "import-access/jsdoc": ERROR,

      // errors
      "import/no-unresolved": ERROR,
      "import/no-relative-packages": ERROR,
      "import/no-extraneous-dependencies": error({
        devDependencies: [
          "**/*.{test,test-d,stories,dev}.*",
          "**/dev/**",
          "!**/src/**",
        ],
      }),
      "import/extensions": error("ignorePackages", {
        js: never,
        jsx: never,
        ts: never,
        tsx: never,
      }),

      // warnings
      "import/no-deprecated": WARN,
      "import/no-useless-path-segments": warn({
        noUselessIndex: true,
        commonjs: true,
      }),
      "import/newline-after-import": WARN,
      "import/order": warn({
        groups: [
          "builtin",
          "external",
          "internal",
          "parent",
          "sibling",
          "index",
        ],
        pathGroups: [{ pattern: "~/**", group: "internal" }],
        alphabetize: { order: "asc" },
        "newlines-between": never,
      }),
    },
  },
];
