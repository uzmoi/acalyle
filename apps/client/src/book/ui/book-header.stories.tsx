import type { Meta, StoryObj } from "@storybook/react";
import { BookHeader } from "./book-header";

export default {
    title: "Book / BookHeader",
    component: BookHeader,
} satisfies Meta<typeof BookHeader>;

type Story = StoryObj<typeof BookHeader>;

export const Default: Story = {
    args: {
        bookRef: "@handle",
    },
};
