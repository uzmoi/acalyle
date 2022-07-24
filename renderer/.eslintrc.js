// @ts-check
/* eslint-disable import/unambiguous */

/** @type {import("eslint/lib/shared/types").ConfigData} */
module.exports = {
    extends: ["plugin:oreore-config/standard"],
    parserOptions: {
        project: "tsconfig.json",
    },
    ignorePatterns: ["**/__generated__/**"],
    overrides: [
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
    ],
    rules: {
        "import/extensions": ["warn", "ignorePackages", {
            ts: "never",
            tsx: "never",
        }],
    },
};
