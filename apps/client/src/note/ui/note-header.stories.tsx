import type { Meta, StoryObj } from "@storybook/react";
import { NoteHeader } from "./note-header";

export default {
    title: "Note / NoteHeader",
    component: NoteHeader,
} satisfies Meta<typeof NoteHeader>;

type Story = StoryObj<typeof NoteHeader>;

export const Default: Story = {};
