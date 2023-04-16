// @ts-check

// eslint-disable-next-line import/no-extraneous-dependencies
import eslint from "@eslint/js";
import {
    importConfig,
    react,
    typescript,
    typescriptRecommended,
    typescriptRecommendedRequiringTypeChecking,
} from "@acalyle/eslint-config";

/** @type {import("eslint").Linter.FlatConfig[]} */
// eslint-disable-next-line import/no-default-export
export default [
    {
        ignores: [
            "app/**",
            "apps/tauri/src-tauri/**",
            "**/dist/**",
            "**/coverage/**",
            "**/__generated__/**",
            "**/__*",
            "**/*.d.ts",
        ],
    },
    eslint.configs.recommended,
    {
        linterOptions: {
            reportUnusedDisableDirectives: true,
        },
        languageOptions: {
            parserOptions: {
                project: [
                    "tsconfig.*.json",
                    "apps/*/tsconfig.json",
                    "packages/*/tsconfig.json",
                ],
            },
        },
    },
    typescript,
    typescriptRecommended,
    typescriptRecommendedRequiringTypeChecking,
    ...react,
    importConfig,
];
