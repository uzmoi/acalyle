import { globalStyle } from "@macaron-css/core";
import type { Preview } from "@storybook/react";
import { devTheme } from "../src/theme/test-theme";

globalStyle("*, ::before, ::after", {
    boxSizing: "border-box",
    margin: 0,
});

const preview: Preview = {
    parameters: {
        layout: "centered",
        actions: { argTypesRegex: "^on[A-Z].*" },
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
