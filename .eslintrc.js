// @ts-check
/* eslint-disable import/unambiguous */

/** @type {import("eslint/lib/shared/types").ConfigData} */
module.exports = {
    extends: ["plugin:oreore-config/standard"],
    parserOptions: {
        project: "tsconfig.config.json",
    },
    settings: {
        "import/resolver": {
            typescript: {
                project: [
                    "tsconfig.config.json",
                    "tsconfig.main.json",
                    "tsconfig.preload.json",
                    "tsconfig.renderer.json",
                    "apps/tauri/tsconfig.json",
                    "apps/client/tsconfig.json",
                    "packages/router/tsconfig.json",
                    "packages/core/tsconfig.json",
                    "packages/ui/tsconfig.json",
                ],
            },
        },
    },
    ignorePatterns: ["/app", "**/__generated__/**"],
    reportUnusedDisableDirectives: true,
    overrides: [
        {
            files: "*.config.*",
            rules: {
                "import/no-default-export": "off",
            },
        },
        {
            files: "*.tsx",
            extends: [
                "plugin:react/recommended",
                "plugin:react/jsx-runtime",
                "plugin:react-hooks/recommended",
                // "plugin:oreore-config/react",
            ],
            settings: {
                react: { version: "detect" },
            },
            rules: {
                "react/prop-types": "off",
            },
        },
        {
            files: ["main/src/**"],
            parserOptions: { project: "tsconfig.main.json" },
        },
        {
            files: ["preload/src/**"],
            parserOptions: { project: "tsconfig.preload.json" },
        },
        {
            files: ["renderer/src/**", "renderer/types.d.ts"],
            parserOptions: { project: "tsconfig.renderer.json" },
        },
        {
            files: ["apps/tauri/src/**"],
            parserOptions: { project: "apps/tauri/tsconfig.json" },
        },
        {
            files: ["apps/client/src/**"],
            parserOptions: { project: "apps/client/tsconfig.json" },
        },
        {
            files: ["packages/router/src/**"],
            parserOptions: { project: "packages/router/tsconfig.json" },
        },
        {
            files: ["packages/core/src/**"],
            parserOptions: { project: "packages/core/tsconfig.json" },
        },
        {
            files: ["packages/ui/src/**"],
            parserOptions: { project: "packages/ui/tsconfig.json" },
        },
    ],
    rules: {
        "import/extensions": ["warn", "ignorePackages", {
            ts: "never",
            tsx: "never",
        }],
        "import/no-unresolved": ["warn", {
            ignore: ["^electron/(main|renderer)$"],
        }],
    },
};
