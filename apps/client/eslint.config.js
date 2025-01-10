// @ts-check

import { createConfig } from "@acalyle/eslint-config";
import unocss from "@unocss/eslint-config/flat";

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
    ...createConfig({
        react: true,
    }),
    unocss,
    {
        files: ["**/*.tsx"],
        rules: {
            "unocss/enforce-class-compile": "warn",
        },
    },
];
