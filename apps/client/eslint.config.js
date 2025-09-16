// @ts-check

import { createConfig, warn } from "@acalyle/eslint-config";
import unocss from "@unocss/eslint-config/flat";
import storybook from "eslint-plugin-storybook";

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...createConfig({ react: true }),
  /** @type {import("eslint").Linter.Config} */ /** @type {object} */ (unocss),
  {
    rules: {
      "import-access/jsdoc": warn({ defaultImportability: "package" }),
      "unocss/enforce-class-compile": "warn",
    },
  },
  ...storybook.configs["flat/recommended"],
];
