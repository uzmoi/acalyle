import ts from "@typescript-eslint/eslint-plugin";
import parser from "@typescript-eslint/parser";
import type { ESLint, Linter } from "eslint";
import { replacePluginName, warn } from "./util";

export const typescriptFiles = "**/*.{ts,mts,cts,tsx,mtx,ctx}";

export const typescript: Linter.FlatConfig = {
    files: [typescriptFiles],
    plugins: {
        // TODO: Rename to "ts".
        "@typescript-eslint": ts as unknown as ESLint.Plugin,
    },
    languageOptions: {
        parser: parser as Linter.ParserModule,
    },
};

export const typescriptRecommended: Linter.FlatConfig = {
    files: [typescriptFiles],
    rules: replacePluginName(
        {
            ...ts.configs["eslint-recommended"]?.overrides?.[0]?.rules,
            ...ts.configs["recommended"]?.rules,
        },
        {}, // TODO: { "@typescript-eslint": "ts" },
    ),
};

export const typescriptRecommendedRequiringTypeChecking: Linter.FlatConfig = {
    files: [typescriptFiles],
    rules: replacePluginName(
        ts.configs["recommended-requiring-type-checking"]?.rules,
        {}, // TODO: { "@typescript-eslint": "ts" },
    ),
};

export const typescriptStrict: Linter.FlatConfig = {
    files: [typescriptFiles],
    rules: replacePluginName(
        ts.configs["strict"]?.rules,
        {}, // TODO: { "@typescript-eslint": "ts" },
    ),
};

export const typescriptCustom: Linter.FlatConfig = {
    files: [typescriptFiles],
    rules: {
        "@typescript-eslint/ban-types": warn({
            extendDefaults: true,
            types: { "{}": false },
        }),
        "@typescript-eslint/no-namespace": warn({
            allowDeclarations: true,
            allowDefinitionFiles: true,
        }),
        "@typescript-eslint/no-unused-vars": warn({
            varsIgnorePattern: "^_",
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
            ...[false, true].map(unused => ({
                selector: "variable",
                modifiers: ["const", unused && "unused"].filter(Boolean),
                format: ["camelCase", "PascalCase", "UPPER_CASE"],
                leadingUnderscore: unused ? "allow" : undefined,
            })),
            {
                selector: ["objectLiteralProperty", "typeProperty"],
                format: ["camelCase", "PascalCase"],
                leadingUnderscore: "allowDouble",
            },
            {
                selector: ["objectLiteralProperty", "typeProperty"],
                modifiers: ["requiresQuotes"],
                format: null,
            },
            ...["private", "protected"].map(modifier => ({
                selector: "memberLike",
                modifiers: [modifier],
                format: ["camelCase"],
                leadingUnderscore: "allow",
            })),
            {
                selector: "memberLike",
                modifiers: ["private"],
                filter: /.{3}/.source,
                format: ["camelCase"],
                leadingUnderscore: "require",
            },
            ...[false, true].map(unused => ({
                selector: "typeLike",
                modifiers: unused ? ["unused"] : undefined,
                format: ["PascalCase"],
                leadingUnderscore: unused ? "allow" : undefined,
            })),
        ),
    },
};
