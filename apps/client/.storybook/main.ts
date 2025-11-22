import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { defineMain } from "@storybook/react-vite/node";

const require = createRequire(import.meta.url);

export default defineMain({
  framework: getAbsolutePath("@storybook/react-vite"),
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(ts|tsx)"],
  addons: [
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
    "@chromatic-com/storybook",
  ],
});

// oxlint-disable-next-line func-style
function getAbsolutePath(value: string): string {
  return dirname(require.resolve(join(value, "package.json")));
}
