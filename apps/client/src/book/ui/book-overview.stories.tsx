import type { Meta, StoryObj } from "@storybook/react";
import { BookOverview } from "./book-overview";

export default {
    title: "Book / BookOverview",
    component: BookOverview,
    parameters: {
        layout: "centered",
    },
} satisfies Meta<typeof BookOverview>;

type Story = StoryObj<typeof BookOverview>;

export const Default: Story = {};
