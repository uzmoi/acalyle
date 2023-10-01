import type { ESLint, Linter } from "eslint";
import importPlugin from "eslint-plugin-import";
import importAccess from "eslint-plugin-import-access";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import { ERROR, WARN, error, never, warn } from "./util";

export const importConfig: Linter.FlatConfig = {
    plugins: {
        import: importPlugin,
        "import-access": { ...importAccess } as ESLint.Plugin,
        "simple-import-sort": simpleImportSort,
    },
    settings: {
        "import/resolver": "typescript",
    },
    rules: {
        ...(importPlugin.configs?.["recommended"] as ESLint.ConfigData).rules,
        ...(importPlugin.configs?.["typescript"] as ESLint.ConfigData).rules,
        ...(importPlugin.configs?.["react"] as ESLint.ConfigData).rules,
        "sort-imports": warn({ ignoreDeclarationSort: true }),
        "simple-import-sort/exports": WARN,
        "import-access/jsdoc": ERROR,
        "import/no-absolute-path": ERROR,
        "import/no-self-import": WARN,
        "import/no-cycle": warn({ maxDepth: 16, ignoreExternal: true }),
        "import/no-useless-path-segments": warn({
            noUselessIndex: true,
            commonjs: true,
        }),
        "import/no-extraneous-dependencies": error({
            devDependencies: ["**/*.{test,spec}.*", "!**/src/**"],
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
};
