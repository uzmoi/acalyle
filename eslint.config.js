// @ts-check

import {
    typescript,
    typescriptRecommendedRequiringTypeChecking,
} from "@acalyle/eslint-config";
import { readFile } from "node:fs/promises";
import { parse } from "jsonc-parser";

/** @type {{ references: { path: string }[] }} */
const tsconfig = parse(await readFile("./tsconfig.json", "utf8"));

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
    {
        ignores: [
            "/app",
            "/apps/tauri/src-tauri",
            "**/dist/**",
            "**/coverage/**",
            "**/__generated__/**",
            "**/*.d.ts",
        ],
    },
    {
        linterOptions: {
            reportUnusedDisableDirectives: true,
        },
    },
    typescript,
    typescriptRecommendedRequiringTypeChecking,
    {
        languageOptions: {
            parserOptions: {
                project: tsconfig.references.map(reference => reference.path),
            },
        },
    },
];
