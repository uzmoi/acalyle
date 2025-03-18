import "@acalyle/ui/dist/style.css";
// eslint-disable-next-line import/no-unresolved
import "virtual:uno.css";

import type { Preview } from "@storybook/react";
import { Provider } from "../src/dev/provider";
import { withTanstackRouter } from "../src/dev/sb-router";

const preview: Preview = {
  parameters: {
    layout: "centered",
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  tags: ["autodocs"],
  decorators: [withTanstackRouter, story => <Provider>{story()}</Provider>],
};

export default preview;
