import type { Meta, StoryObj } from "@storybook/react";
import { fireEvent, within } from "@storybook/test";
import { NoteMenuButton } from "./note-menu";

export default {
    title: "Note / NoteMenu",
    component: NoteMenuButton,
} satisfies Meta<typeof NoteMenuButton>;

type Story = StoryObj<typeof NoteMenuButton>;

export const Default: Story = {
    async play({ canvasElement }) {
        const canvas = within(canvasElement);
        const button = await canvas.findByRole("button");
        await fireEvent.click(button);
    },
};
