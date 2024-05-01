import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./button";

export default {
    title: "Control/Button",
    component: Button,
    args: {
        children: "hoge",
    },
} satisfies Meta<typeof Button>;

type Story = StoryObj<typeof Button>;

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
