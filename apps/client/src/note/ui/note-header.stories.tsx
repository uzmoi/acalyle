import type { Meta, StoryObj } from "@storybook/react";
import { getNote } from "./__mocks__/hook";
import { NoteHeader } from "./note-header";

export default {
    title: "Note / NoteHeader",
    component: NoteHeader,
} satisfies Meta<typeof NoteHeader>;

type Story = StoryObj<typeof NoteHeader>;

export const Default: Story = {
    args: {
        bookRef: "@handle",
        note: getNote("id"),
    },
};
