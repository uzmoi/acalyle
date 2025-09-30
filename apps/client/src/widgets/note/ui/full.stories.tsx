import type { Meta, StoryObj } from "@storybook/react-vite";
import { createRandomNote } from "~/entities/note/dev";
import { FullNote } from "./full";

export default {
  component: FullNote,
} satisfies Meta<typeof FullNote>;

type Story = StoryObj<typeof FullNote>;

export const Default: Story = {
  loaders: () => ({
    args: { note: createRandomNote() },
  }),
};
