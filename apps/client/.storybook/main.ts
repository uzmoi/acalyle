import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import type { StorybookConfig } from "@storybook/react-vite";

const require = createRequire(import.meta.url);

const config: StorybookConfig = {
  framework: getAbsolutePath("@storybook/react-vite"),
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(ts|tsx)"],
  addons: [
    getAbsolutePath("@storybook/addon-a11y"),
    getAbsolutePath("@storybook/addon-docs"),
    getAbsolutePath("storybook-addon-manual-mocks"),
    getAbsolutePath("@chromatic-com/storybook"),
  ],
};

export default config;

// oxlint-disable-next-line func-style, no-explicit-any
function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, "package.json")));
}
