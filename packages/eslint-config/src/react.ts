import type { ESLint, Linter } from "eslint";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import { testingLibrary } from "./testing-library";
import { tsExts } from "./util";

export const react: Linter.FlatConfig[] = [
  {
    files: ["**/*.tsx"],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: { jsx: true },
        jsxPragma: null,
      },
    },
  },
  {
    files: [`**/*.${tsExts}`],
    settings: {
      react: { version: "detect" },
    },
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooks,
    },
    rules: {
      ...(reactPlugin.configs?.recommended as ESLint.ConfigData).rules,
      ...(reactPlugin.configs?.["jsx-runtime"] as ESLint.ConfigData).rules,
      ...(reactHooks.configs?.recommended as ESLint.ConfigData).rules,
      "react/prop-types": "off",
    },
  },
  testingLibrary("react"),
];
