import type { Meta, StoryObj } from "@storybook/react";
import { BookOverview } from "./book-overview";

export default {
    title: "Book / BookOverview",
    component: BookOverview,
} satisfies Meta<typeof BookOverview>;

type Story = StoryObj<typeof BookOverview>;

export const Default: Story = {
    args: {
        bookId: "id" as never,
    },
};
