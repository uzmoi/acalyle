// @ts-check

import { parse } from "jsonc-parser";
import { readFile } from "node:fs/promises";
import {
    importConfig,
    react,
    typescript,
    typescriptRecommended,
    typescriptRecommendedRequiringTypeChecking,
} from "@acalyle/eslint-config";

/** @type {{ references: { path: string }[] }} */
const tsconfig = parse(await readFile("./tsconfig.json", "utf8"));

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
    {
        linterOptions: {
            reportUnusedDisableDirectives: true,
        },
        languageOptions: {
            parserOptions: {
                project: tsconfig.references.map(reference => reference.path),
            },
        },
    },
    typescript,
    typescriptRecommended,
    typescriptRecommendedRequiringTypeChecking,
    ...react,
    importConfig,
];
