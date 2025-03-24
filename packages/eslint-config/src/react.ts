import type { Linter } from "eslint";
import { defineConfig } from "eslint/config";
import reactPlugin from "eslint-plugin-react";
import testingLibraryPlugin from "eslint-plugin-testing-library";
import { OFF } from "./util";

export const react: Linter.Config[] = [
  reactPlugin.configs.flat.recommended,
  reactPlugin.configs.flat["jsx-runtime"],
  {
    settings: {
      react: { version: "detect" },
    },
    rules: {
      "react/prop-types": OFF,
    },
  },
  ...defineConfig({
    files: ["**/*.test.*"],
    extends: [testingLibraryPlugin.configs["flat/react"]],
  }),
];
