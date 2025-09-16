import type { Meta, StoryObj } from "@storybook/react-vite";
import { FullNote } from "./full";

export default {
  title: "Note / Note",
  component: FullNote,
} satisfies Meta<typeof FullNote>;

type Story = StoryObj<typeof FullNote>;

export const Default: Story = {};
