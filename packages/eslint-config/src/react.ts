import type { Linter } from "eslint";
import { defineConfig } from "eslint/config";
import reactPlugin from "eslint-plugin-react";
import testingLibraryPlugin from "eslint-plugin-testing-library";
import { OFF, WARN, warn } from "./util";

export const react: Linter.Config[] = [
  reactPlugin.configs.flat.recommended,
  reactPlugin.configs.flat["jsx-runtime"],
  {
    settings: {
      react: { version: "detect" },
    },
    rules: {
      "react/display-name": OFF,
      "react/prop-types": OFF,
    },
  },
  ...defineConfig({
    extends: [testingLibraryPlugin.configs["flat/react"]],
    rules: {
      "testing-library/consistent-data-testid": warn({
        testIdPattern: "^[a-z_]+$",
      }),
      "testing-library/no-debugging-utils": warn({
        utilsToCheckFor: { debug: false },
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
