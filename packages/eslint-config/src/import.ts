import type { Linter } from "eslint";
import importPlugin from "eslint-plugin-import";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import { WARN, never, warn } from "./util";

export const importConfig: Linter.FlatConfig = {
    plugins: {
        import: importPlugin,
        "simple-import-sort": simpleImportSort,
    },
    settings: {
        "import/resolver": "typescript",
    },
    rules: (<T>(rules: Record<string, T>) =>
        rules as Record<string, NonNullable<T>>)({
        ...importPlugin.configs?.["recommended"]?.rules,
        ...importPlugin.configs?.["typescript"]?.rules,
        ...importPlugin.configs?.["react"]?.rules,
        "sort-imports": warn({ ignoreDeclarationSort: true }),
        "simple-import-sort/exports": WARN,
        "import/no-absolute-path": WARN,
        "import/no-self-import": WARN,
        "import/no-cycle": warn({ maxDepth: 16, ignoreExternal: true }),
        "import/no-useless-path-segments": warn({
            noUselessIndex: true,
            commonjs: true,
        }),
        "import/no-extraneous-dependencies": WARN,
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
    }),
};
