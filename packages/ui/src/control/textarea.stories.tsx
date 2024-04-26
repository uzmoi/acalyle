import type { Meta, StoryObj } from "@storybook/react";
import { TextArea } from "./textarea";

export default {
    title: "Control/TextArea",
    component: TextArea,
    argTypes: {
        value: { type: "string" },
    },
    args: {
        value: undefined,
        defaultValue: "お前のギターの\nせいでバンドが\n死んでいる",
    },
} satisfies Meta<typeof TextArea>;

type Story = StoryObj<typeof TextArea>;

export const Solid: Story = {
    args: {
        variant: "solid",
    },
};

export const Outline: Story = {
    args: {
        variant: "outline",
    },
};

export const Unstyled: Story = {
    args: {
        variant: "unstyled",
    },
};
