import ts from "@typescript-eslint/eslint-plugin";
import parser from "@typescript-eslint/parser";
import type { ESLint, Linter } from "eslint";
import { replacePluginName, warn } from "./util";

export const typescriptFiles = ["**/*.{ts,tsx,mts,cts}"];

export const typescript: Linter.FlatConfig = {
    files: typescriptFiles,
    plugins: {
        // TODO Rename to "ts".
        "@typescript-eslint": ts as unknown as ESLint.Plugin,
    },
    languageOptions: {
        parser: parser as Linter.ParserModule,
    },
};

export const typescriptRecommended: Linter.FlatConfig = {
    files: typescriptFiles,
    rules: replacePluginName(
        {
            ...ts.configs["eslint-recommended"]?.overrides?.[0]?.rules,
            ...ts.configs["recommended"]?.rules,
        },
        {}, // TODO { "@typescript-eslint": "ts" },
    ),
};

export const typescriptRecommendedRequiringTypeChecking: Linter.FlatConfig = {
    files: typescriptFiles,
    rules: replacePluginName(
        ts.configs["recommended-requiring-type-checking"]?.rules,
        {}, // TODO { "@typescript-eslint": "ts" },
    ),
};

export const typescriptCustom: Linter.FlatConfig = {
    files: typescriptFiles,
    rules: {
        "@typescript-eslint/no-namespace": warn({
            allowDeclarations: true,
            allowDefinitionFiles: true,
        }),
        "@typescript-eslint/no-unused-vars": warn({
            varsIgnorePattern: "^_",
            destructuredArrayIgnorePattern: "^_",
            argsIgnorePattern: "^_",
            caughtErrors: "all",
            caughtErrorsIgnorePattern: "^_",
        }),
        "@typescript-eslint/naming-convention": warn(
            { selector: "default", format: ["camelCase"] },
            {
                selector: "variableLike",
                modifiers: ["unused"],
                format: ["camelCase"],
                leadingUnderscore: "allow",
            },
            {
                selector: "variable",
                modifiers: ["const"],
                format: ["camelCase", "PascalCase", "UPPER_CASE"],
            },
            {
                selector: "variable",
                modifiers: ["const", "unused"],
                format: ["camelCase", "PascalCase", "UPPER_CASE"],
                leadingUnderscore: "allow",
            },
            {
                selector: "property",
                format: ["camelCase", "PascalCase"],
                leadingUnderscore: "allowDouble",
            },
            {
                selector: "property",
                modifiers: ["requiresQuotes"],
                format: null,
            },
            { selector: "typeLike", format: ["PascalCase"] },
            {
                selector: "typeLike",
                modifiers: ["unused"],
                format: ["PascalCase"],
                leadingUnderscore: "allow",
            },
        ),
    },
};
