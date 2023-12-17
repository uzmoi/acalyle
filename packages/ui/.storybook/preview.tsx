import type { Preview } from "@storybook/react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from "react";
import { createTheme, vars } from "../src";

// eslint-disable-next-line acalyle/no-module-side-effect
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
    font: {},
    zIndex: {},
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
    decorators: [
        // eslint-disable-next-line @typescript-eslint/naming-convention
        Story => (
            <div style={theme}>
                <Story />
            </div>
        ),
    ],
};

export default preview;
