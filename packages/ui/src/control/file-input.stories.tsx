import type { Meta, StoryObj } from "@storybook/react";
import { FileInput } from "./file-input";

export default {
    title: "Control/FileInput",
    component: FileInput,
} satisfies Meta<typeof FileInput>;

type Story = StoryObj<typeof FileInput>;

export const Single: Story = {
    args: {},
};

export const Multi: Story = {
    args: {
        multiple: true,
    },
};
