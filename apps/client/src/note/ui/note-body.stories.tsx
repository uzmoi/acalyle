import type { Meta, StoryObj } from "@storybook/react";
import { NoteBody } from "./note-body";

export default {
    title: "Note / NoteBody",
    component: NoteBody,
} satisfies Meta<typeof NoteBody>;

type Story = StoryObj<typeof NoteBody>;

export const Default: Story = {
    args: {
        noteId: "id",
        contents: "おかわり頂けるだろうか。\nもう一度ご飯いただこう。",
    },
};
