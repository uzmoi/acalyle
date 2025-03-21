import type { ESLint, Linter } from "eslint";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import { testingLibrary } from "./testing-library";
import { tsExts } from "./util";

export const react: Linter.FlatConfig[] = [
  reactPlugin.configs.flat.recommended,
  reactPlugin.configs.flat["jsx-runtime"],
  {
    files: ["**/*.tsx"],
    languageOptions: {
      parserOptions: { jsxPragma: null },
    },
  },
  {
    files: [`**/*.${tsExts}`],
    settings: {
      react: { version: "detect" },
    },
    plugins: {
      "react-hooks": reactHooks,
    },
    rules: {
      ...(reactHooks.configs!.recommended as ESLint.ConfigData).rules,
      "react/prop-types": "off",
    },
  },
  testingLibrary("react"),
];
