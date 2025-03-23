import type { ESLint, Linter } from "eslint";
import importPlugin from "eslint-plugin-import";
import importAccess from "eslint-plugin-import-access/flat-config";
import { ERROR, OFF, WARN, error, never, warn } from "./util";

export const importConfig: Linter.Config[] = [
  importPlugin.flatConfigs.recommended,
  importPlugin.flatConfigs.typescript,
  importPlugin.flatConfigs.react,
  {
    plugins: {
      "import-access": importAccess as ESLint.Plugin,
    },
    settings: {
      "import/resolver": "typescript",
    },
    rules: {
      "sort-imports": OFF,
      "import-access/jsdoc": ERROR,
      "import/no-absolute-path": ERROR,
      "import/no-self-import": WARN,
      "import/no-cycle": warn({ maxDepth: 16, ignoreExternal: true }),
      "import/no-useless-path-segments": warn({
        noUselessIndex: true,
        commonjs: true,
      }),
      "import/no-extraneous-dependencies": error({
        devDependencies: ["**/*.{test,test-d,stories}.*", "!**/src/**"],
      }),
      "import/unambiguous": WARN,
      "import/first": WARN,
      "import/no-duplicates": WARN,
      "import/extensions": warn("ignorePackages", {
        js: never,
        jsx: never,
        ts: never,
        tsx: never,
      }),
      "import/order": warn({
        groups: [
          ["builtin", "external"],
          "internal",
          "parent",
          "sibling",
          "index",
        ],
        pathGroups: [{ pattern: "~/**", group: "internal" }],
        alphabetize: { order: "asc" },
        ["newlines-between"]: never,
      }),
      "import/newline-after-import": WARN,
      "import/max-dependencies": warn({ max: 16 }),
      "import/no-named-default": WARN,
      "import/no-default-export": WARN,
    },
  },
  {
    files: ["!**/src/**", "**/*.stories.*"],
    rules: {
      "import/no-default-export": OFF,
    },
  },
];
