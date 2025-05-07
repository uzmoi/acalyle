import type { Preview } from "@storybook/react";
import { devTheme } from "./theme";

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
  decorators: [story => <div style={devTheme}>{story()}</div>],
};

export default preview;
