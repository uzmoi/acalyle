import type { ESLint, Linter } from "eslint";
import tsEslint from "typescript-eslint";
import {
    OFF,
    extendsFlatRules,
    replacePluginName,
    replaceWarn,
    tsExts,
    warn,
} from "./util";

export type TypeScriptESLintConfigName = keyof typeof tsEslint.configs;

export const typescript = (
    ...configs: readonly TypeScriptESLintConfigName[]
): Linter.FlatConfig => ({
    files: [`**/*.${tsExts}`],
    plugins: {
        // TODO: Rename to "ts".
        "@typescript-eslint": tsEslint.plugin as ESLint.Plugin,
    },
    languageOptions: {
        parser: tsEslint.parser as Linter.ParserModule,
        parserOptions: { project: true, sourceType: "module" },
    },
    rules: {
        ...replacePluginName(
            extendsFlatRules(tsEslint, configs, (rules, configName) =>
                configName.startsWith("stylistic") ? replaceWarn(rules) : rules,
            ),
            {}, // TODO: { "@typescript-eslint": "ts" },
        ),
        "@typescript-eslint/consistent-type-definitions": OFF,
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
            ...[false, true].map(unused => ({
                // NOTE: selectorは配列でなくとも良いはずだが、
                // typescript-eslintのスキーマが非対応なのかエラーが出る
                selector: ["import"],
                modifiers: unused ? ["unused"] : undefined,
                format: ["camelCase", "PascalCase"],
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
});
