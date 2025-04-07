import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { Button } from "./button";

const meta: Meta<typeof Button> = {
  title: "Control/Button",
  component: Button,
  args: {
    onClick: fn(),
    children: "hoge",
  },
};

export default meta;

type Story = StoryObj<typeof Button>;

export const solid: Story = {
  args: {},
};

export const unstyled: Story = {
  args: { unstyled: true },
};
