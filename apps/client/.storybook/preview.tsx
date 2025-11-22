// oxlint-disable-next-line no-unassigned-import
import "@acalyle/ui/dist/style.css";
// eslint-disable-next-line import/no-unresolved
// oxlint-disable-next-line no-unassigned-import
import "virtual:uno.css";

import { definePreview } from "@storybook/react-vite";
import addonA11y from "@storybook/addon-a11y";
import addonDocs from "@storybook/addon-docs";
import { faker } from "@faker-js/faker";
import { xxHash32 } from "js-xxhash";
import {
  darkBg,
  lightBg,
  withTanstackRouter,
  withThemeProvider,
} from "#app/dev";

const preview = definePreview({
  addons: [addonA11y(), addonDocs()],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    backgrounds: {
      options: {
        light: { name: "Light", value: lightBg },
        dark: { name: "Dark", value: darkBg },
      },
    },
  },
  initialGlobals: {
    backgrounds: { value: "dark" },
  },
  decorators: [withTanstackRouter, withThemeProvider],
  render(args, { component, loaded }) {
    const Component = component!;
    return <Component {...args} {...loaded.args} />;
  },
  loaders({ id }) {
    faker.seed(xxHash32(id));
  },
  beforeEach({ id }) {
    faker.seed(xxHash32(id));
  },
});

/** @public */
export default preview;
