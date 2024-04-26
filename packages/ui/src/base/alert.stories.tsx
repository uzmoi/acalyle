import type { Meta, StoryObj } from "@storybook/react";
import { Alert } from "./alert";

export default {
    title: "Base/Alert",
    component: Alert,
    args: {
        children: "Alert",
    },
} satisfies Meta<typeof Alert>;

type Story = StoryObj<typeof Alert>;

export const Error: Story = {
    args: {
        type: "error",
    },
};

export const Warning: Story = {
    args: {
        type: "warning",
    },
};

export const Success: Story = {
    args: {
        type: "success",
    },
};
