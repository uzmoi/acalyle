import type { Meta, StoryObj } from "@storybook/react";
import { TextInput } from "./text-input";

export default {
    title: "Control/TextInput",
    component: TextInput,
    parameters: {
        layout: "centered",
    },
} satisfies Meta<typeof TextInput>;

type Story = StoryObj<typeof TextInput>;

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
