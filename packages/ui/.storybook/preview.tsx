import type { Preview } from "@storybook/react";
import { devTheme } from "../src/theme/test-theme";

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
  decorators: [story => <div style={devTheme}>{story()}</div>],
};

export default preview;
