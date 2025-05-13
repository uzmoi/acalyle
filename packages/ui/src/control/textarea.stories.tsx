import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { TextArea } from "./textarea";

const meta: Meta<typeof TextArea> = {
  component: TextArea,
  argTypes: {
    value: { type: "string" },
  },
  args: {
    value: undefined,
    defaultValue: "お前のギターの\nせいでバンドが\n死んでいる",
    onChange: fn(),
    onValueChange: fn(),
  },
};

export default meta;

type Story = StoryObj<typeof TextArea>;

export const Solid: Story = {
  args: {},
};

export const Unstyled: Story = {
  args: { unstyled: true },
};
