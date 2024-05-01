import "@acalyle/ui/dist/style.css";

import { macaron$ } from "@macaron-css/core";
import type { Preview } from "@storybook/react";
import { Provider } from "../src/dev/provider";

macaron$(() => {
    require("../src/dev/reset-style");
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
    decorators: [story => <Provider>{story()}</Provider>],
};

export default preview;
