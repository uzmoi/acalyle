import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { Select } from "./select";

const options = ["hoge", "fuga", "piyo"];

const meta: Meta<typeof Select> = {
  title: "Control/Select",
  component: Select,
  render: props => (
    <Select {...props}>
      {options.map(option => (
        <Select.Option key={option}>{option}</Select.Option>
      ))}
    </Select>
  ),
  args: {
    onChange: fn(),
    onValueChange: fn(),
  },
};

export default meta;

type Story = StoryObj<typeof Select>;

export const solid: Story = {
  args: {},
};

export const unstyled: Story = {
  args: { unstyled: true },
};
