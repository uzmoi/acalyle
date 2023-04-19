import type { Linter } from "eslint";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";

export const react: Linter.FlatConfig[] = [
    {
        files: ["**/*.{jsx,tsx}"],
        languageOptions: {
            parserOptions: {
                ecmaFeatures: { jsx: true },
                jsxPragma: null,
            },
        },
        settings: {
            react: { version: "detect" },
        },
        plugins: {
            react: reactPlugin,
            "react-hooks": reactHooks,
        },
        rules: {
            ...reactPlugin.configs?.["recommended"]?.rules,
            ...reactPlugin.configs?.["jsx-runtime"]?.rules,
            ...reactHooks.configs?.["recommended"]?.rules,
            ...{}, // 型エラー抑制
        },
    },
    {
        files: ["**/*.tsx"],
        rules: { "react/prop-types": "off" },
    },
];
