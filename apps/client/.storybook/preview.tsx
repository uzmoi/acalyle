import "@acalyle/ui/dist/style.css";
// eslint-disable-next-line import/no-unresolved
import "virtual:uno.css";

import type { Preview } from "@storybook/react-vite";
import { faker } from "@faker-js/faker";
import { xxHash32 } from "js-xxhash";
import { withThemeProvider, withTanstackRouter } from "../src/app/dev";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  decorators: [withTanstackRouter, withThemeProvider],
  beforeEach({ id }) {
    faker.seed(xxHash32(id));
  },
};

export default preview;
