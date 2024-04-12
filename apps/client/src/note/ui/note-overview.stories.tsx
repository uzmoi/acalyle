import type { Meta, StoryObj } from "@storybook/react";
import { NoteOverview } from "./note-overview";

export default {
    title: "Note / NoteOverview",
    component: NoteOverview,
    parameters: {
        layout: "centered",
    },
} satisfies Meta<typeof NoteOverview>;

type Story = StoryObj<typeof NoteOverview>;

export const Default: Story = {
    args: {
        bookId: "book-id" as never,
        noteId: "note-id" as never,
    },
};
