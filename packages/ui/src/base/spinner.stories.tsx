import type { Meta, StoryObj } from "@storybook/react";
import { Spinner } from "./spinner";

export default {
    title: "Base/Spinner",
    component: Spinner,
    parameters: {
        layout: "centered",
    },
} satisfies Meta<typeof Spinner>;

type Story = StoryObj<typeof Spinner>;

export const Default: Story = {
    decorators: [story => <div style={{ "--size": "2em" }}>{story()}</div>],
};
