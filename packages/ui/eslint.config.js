import { createConfig } from "@acalyle/eslint-config";
import storybook from "eslint-plugin-storybook";

export default [
  ...createConfig({ react: true }),
  ...storybook.configs["flat/recommended"],
];
