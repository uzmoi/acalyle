import "@acalyle/ui/dist/style.css";
// eslint-disable-next-line import/no-unresolved
import "virtual:uno.css";

import type { Preview } from "@storybook/react-vite";
import { faker } from "@faker-js/faker";
import { xxHash32 } from "js-xxhash";
import { Provider } from "../src/app/dev/provider";
import { withTanstackRouter } from "../src/app/dev/sb-router";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  decorators: [withTanstackRouter, story => <Provider>{story()}</Provider>],
  beforeEach({ id }) {
    faker.seed(xxHash32(id));
  },
};

export default preview;
