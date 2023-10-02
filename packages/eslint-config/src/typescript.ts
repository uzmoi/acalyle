import ts from "@typescript-eslint/eslint-plugin";
import parser from "@typescript-eslint/parser";
import type { ESLint, Linter } from "eslint";
import { OFF, extendsRules, replacePluginName, warn } from "./util";

export const typescriptFiles = "**/*.{ts,mts,cts,tsx,mtx,ctx}";

type TypeScriptESLintConfigName =
    | "all"
    | "recommended"
    | "recommended-type-checked"
    | "strict"
    | "strict-type-checked"
    | "stylistic"
    | "stylistic-type-checked"
    | "disable-type-checked";

export const typescript = (
    ...configs: readonly TypeScriptESLintConfigName[]
): Linter.FlatConfig => ({
    files: [typescriptFiles],
    plugins: {
        // TODO: Rename to "ts".
        "@typescript-eslint": ts as unknown as ESLint.Plugin,
    },
    languageOptions: {
        parser: parser as Linter.ParserModule,
        parserOptions: { sourceType: "module" },
    },
    rules: replacePluginName(
        extendsRules(ts.configs, configs, {
            warn: name => name.startsWith("stylistic"),
        }),
        {}, // TODO: { "@typescript-eslint": "ts" },
    ),
});

export const typescriptCustom: Linter.FlatConfig = {
    files: [typescriptFiles],
    rules: {
        "@typescript-eslint/prefer-for-of": OFF,
        "@typescript-eslint/consistent-type-definitions": warn("type"),
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
