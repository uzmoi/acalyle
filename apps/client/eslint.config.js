// @ts-check

import { createConfig, warn } from "@acalyle/eslint-config";
import unocss from "@unocss/eslint-config/flat";

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
  ...createConfig({
    react: true,
  }),
  unocss,
  {
    files: ["**/*.{ts,mts,cts,tsx}"],
    rules: {
      "import-access/jsdoc": warn({
        defaultImportability: "package",
      }),
      "unocss/enforce-class-compile": "warn",
    },
  },
];
