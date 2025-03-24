// import globals from "globals";
import { OFF, createConfig } from "@acalyle/eslint-config";

export default [
  ...createConfig({
    tsProject: [
      "tsconfig.json",
      "apps/*/tsconfig.json",
      "apps/*/tsconfig.*.json",
      "packages/*/tsconfig.json",
      "packages/*/tsconfig.*.json",
    ],
    ignores: ["apps/tauri/src-tauri/**"],
  }),
  {
    files: ["packages/eslint-config/src/**"],
    rules: {
      "pure-module/pure-module": OFF,
    },
  },
];
