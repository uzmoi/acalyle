import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { TextInput } from "./text-input";

const meta: Meta<typeof TextInput> = {
  component: TextInput,
  args: {
    onChange: fn(),
    onValueChange: fn(),
  },
};

export default meta;

type Story = StoryObj<typeof TextInput>;

export const solid: Story = {
  args: {},
};

export const unstyled: Story = {
  args: { unstyled: true },
};
