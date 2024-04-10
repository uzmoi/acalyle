import type { Meta, StoryObj } from "@storybook/react";
import { fireEvent, within } from "@storybook/test";
import { BiSquare } from "react-icons/bi";
import { NoteMenu } from "./note-menu";

export default {
    title: "Note / NoteMenu",
    component: NoteMenu,
    parameters: {
        layout: "centered",
    },
} satisfies Meta<typeof NoteMenu>;

type Story = StoryObj<typeof NoteMenu>;

export const Default: Story = {
    args: {
        actions: [
            { text: "Item 1", icon: <BiSquare />, onClick() {} },
            { text: "Item 2", icon: <BiSquare />, onClick() {} },
        ],
    },
    async play({ canvasElement }) {
        const canvas = within(canvasElement);
        const button = await canvas.findByRole("button");
        await fireEvent.click(button);
    },
};
