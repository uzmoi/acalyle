import type { Meta, StoryObj } from "@storybook/react";
import { TextArea } from "./textarea";

export default {
    title: "Control/TextArea",
    component: TextArea,
    parameters: {
        layout: "centered",
    },
} satisfies Meta<typeof TextArea>;

type Story = StoryObj<typeof TextArea>;

export const solid: Story = {
    args: {
        variant: "solid",
    },
};

export const outline: Story = {
    args: {
        variant: "outline",
    },
};

export const unstyled: Story = {
    args: {
        variant: "unstyled",
    },
};
