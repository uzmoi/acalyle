import type { ESLint, Linter } from "eslint";
import ts from "@typescript-eslint/eslint-plugin";
import parser from "@typescript-eslint/parser";

export const typescript: Linter.FlatConfig = {
    files: ["**/*.{ts,tsx,mts,cts}"],
    plugins: {
        // TODO Rename to "ts".
        "@typescript-eslint": ts as unknown as ESLint.Plugin,
    },
    languageOptions: {
        parser: parser as Linter.ParserModule,
    },
};

export const typescriptRecommendedRequiringTypeChecking: Linter.FlatConfig = {
    files: ["**/*.{ts,tsx,mts,cts}"],
    rules: Object.fromEntries(
        [
            ...Object.entries(
                ts.configs["eslint-recommended"]?.overrides?.[0]?.rules!,
            ),
            ...Object.entries(
                ts.configs["recommended-requiring-type-checking"]!.rules!,
            ),
        ].map(
            // TODO rule.replace(/^@typescript-eslint\//, "ts/")
            ([rule, ruleEntry]) => [rule, ruleEntry!] as const,
        ),
    ),
};
