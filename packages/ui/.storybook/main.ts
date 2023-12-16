/* eslint-disable acalyle/no-module-side-effect */
import type { StorybookConfig } from "@storybook/react-vite";
import { dirname, join } from "node:path";

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath<T extends string>(value: T) {
    return dirname(require.resolve(join(value, "package.json"))) as T;
}

const config: StorybookConfig = {
    stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
    addons: [
        getAbsolutePath("@storybook/addon-essentials"),
        getAbsolutePath("@storybook/addon-interactions"),
        getAbsolutePath("@storybook/addon-a11y"),
    ],
    framework: getAbsolutePath("@storybook/react-vite"),
    docs: { autodocs: true },
};

export default config;
