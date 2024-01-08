import type { Preview } from "@storybook/react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from "react";
import { createTheme, vars } from "../src";

const theme = createTheme<typeof vars>("acalyle", {
    color: {
        bg: {
            app: "#ddd",
            layout: "#ccc",
            block: "#bbb",
            inline: "#aaa",
        },
        fg: {
            __: "#222",
            mute: "#777",
        },
        accent: "purple",
        denger: "red",
        warning: "yellow",
        success: "green",
    },
    radius: {
        block: "0.25m",
        control: "0.5em",
        layout: "1em",
    },
    font: { mono: "monospace", sans: "sans-serif" },
    zIndex: { contextMenu: 0, max: 0, modal: 0, popover: 0, toast: 0 },
});

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
    decorators: [story => <div style={theme}>{story()}</div>],
};

export default preview;
