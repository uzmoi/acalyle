import type { Linter } from "eslint";
import { defineConfig } from "eslint/config";
import reactPlugin from "eslint-plugin-react";
import testingLibraryPlugin from "eslint-plugin-testing-library";
import { OFF, warn, WARN } from "./util";

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
    extends: [testingLibraryPlugin.configs["flat/react"]],
    rules: {
      "testing-library/consistent-data-testid": warn({
        testIdPattern: "^[a-z_]+$",
      }),
      "testing-library/prefer-explicit-assert": WARN,
      "testing-library/prefer-user-event": WARN,
    },
  }),
  {
    files: ["**/*.stories.*"],
    rules: {
      "testing-library/prefer-screen-queries": OFF,
    },
  },
];
