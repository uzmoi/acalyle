import ts from "@typescript-eslint/eslint-plugin";
import parser from "@typescript-eslint/parser";
import type { ESLint, Linter } from "eslint";

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
    rules: Object.fromEntries(
        Object.entries({
            ...ts.configs["eslint-recommended"]?.overrides?.[0]?.rules,
            ...ts.configs["recommended"]?.rules,
        }).map(
            // TODO rule.replace(/^@typescript-eslint\//, "ts/")
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            ([rule, ruleEntry]) => [rule, ruleEntry!] as const,
        ),
    ),
};

export const typescriptRecommendedRequiringTypeChecking: Linter.FlatConfig = {
    files: typescriptFiles,
    rules: Object.fromEntries(
        Object.entries({
            ...ts.configs["recommended-requiring-type-checking"]?.rules,
        }).map(
            // TODO rule.replace(/^@typescript-eslint\//, "ts/")
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            ([rule, ruleEntry]) => [rule, ruleEntry!] as const,
        ),
    ),
};
