import type { Linter } from "eslint";
import { importConfig } from "./import";
import { react } from "./react";
import { recommended } from "./recommended";
import { typescript } from "./typescript";

export { acalylePlugin } from "./acalyle";
export { type Options, createConfig } from "./create-config";
export * from "./util";

export const configs = {
  recommended,
  import: importConfig,
  react,
  typescript,
} satisfies Record<string, readonly Linter.Config[]>;
