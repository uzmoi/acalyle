import type { Meta, StoryObj } from "@storybook/react";
import { NoteContents } from "./note-contents";

export default {
    title: "Note / NoteContents",
    component: NoteContents,
} satisfies Meta<typeof NoteContents>;

type Story = StoryObj<typeof NoteContents>;

export const Default: Story = {
    args: {
        contents: "ふふっ、ごめん。財布ないわ\nぴぇ……！",
    },
};
