import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { TextInput } from "./text-input";

const meta: Meta<typeof TextInput> = {
  title: "Control/TextInput",
  component: TextInput,
  args: {
    onChange: fn(),
    onValueChange: fn(),
  },
};

export default meta;

type Story = StoryObj<typeof TextInput>;

export const solid: Story = {
  args: {
    variant: "solid",
  },
};

export const outline: Story = {
  args: {
    variant: "outline",
  },
};

export const unstyled: Story = {
  args: {
    variant: "unstyled",
  },
};
