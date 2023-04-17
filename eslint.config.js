// @ts-check

import eslint from "@eslint/js";
import {
    importConfig,
    react,
    typescript,
    typescriptRecommended,
    typescriptRecommendedRequiringTypeChecking,
} from "@acalyle/eslint-config";

const typescriptProject = [
    "tsconfig.*.json",
    "apps/*/tsconfig.json",
    "packages/*/tsconfig.json",
];

/** @type {import("eslint").Linter.FlatConfig[]} */
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
    typescript,
    typescriptRecommended,
    typescriptRecommendedRequiringTypeChecking,
    ...react,
    importConfig,
    {
        files: ["**/*.config.*"],
        rules: {
            "import/no-default-export": "off",
        },
    },
    {
        linterOptions: {
            reportUnusedDisableDirectives: true,
        },
        languageOptions: {
            parserOptions: {
                ecmaVersion: "latest",
                sourceType: "module",
                project: typescriptProject,
            },
        },
        settings: {
            "import/parsers": {
                // cspell:word espree
                espree: [".js", ".cjs", ".mjs", ".jsx"],
            },
            "import/resolver": {
                typescript: {
                    project: typescriptProject,
                },
            },
        },
    },
];
