import "@acalyle/ui/dist/style.css";
import "../src/dev/reset-style";

import type { Preview } from "@storybook/react";
import { Provider } from "../src/dev/provider";

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
    decorators: [story => <Provider>{story()}</Provider>],
};

export default preview;
