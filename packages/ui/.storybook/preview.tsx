import type { Preview } from "@storybook/react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from "react";
import { devTheme } from "../src/theme/test-theme";

const preview: Preview = {
    parameters: {
        actions: { argTypesRegex: "^on[A-Z].*" },
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/,
            },
        },
    },
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    decorators: [story => <div style={devTheme}>{story()}</div>],
};

export default preview;
