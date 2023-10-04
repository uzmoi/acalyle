// @ts-check

import eslint from "@eslint/js";
import globals from "globals";
import { OFF, configs } from "@acalyle/eslint-config";

const typescriptProject = [
    "tsconfig.json",
    "apps/*/tsconfig.json",
    "apps/*/tsconfig.*.json",
    "packages/*/tsconfig.json",
    "packages/*/tsconfig.*.json",
];

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
    {
        ignores: [
            "main/**",
            "renderer/**",
            "scripts/**",
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
        ...configs.acalyle,
        ignores: [
            ...(configs.acalyle.ignores ?? []),
            "packages/eslint-config/**",
        ],
    },
    configs.unicorn,
    configs.typescript("recommended-type-checked", "stylistic-type-checked"),
    configs.typescriptCustom,
    configs.react,
    configs.testingLibrary("react"),
    configs.import,
    {
        files: ["!**/src/**"],
        languageOptions: {
            globals: globals.node,
        },
        rules: {
            "import/no-default-export": OFF,
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
