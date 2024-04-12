import type { Meta, StoryObj } from "@storybook/react";
import { Note } from "./note";

export default {
    title: "Note / Note",
    component: Note,
    parameters: {
        layout: "centered",
    },
} satisfies Meta<typeof Note>;

type Story = StoryObj<typeof Note>;

export const Default: Story = {};
