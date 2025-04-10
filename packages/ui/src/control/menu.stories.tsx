import type { Meta, StoryObj } from "@storybook/react";
import { Menu } from "./menu";

export default {
  component: Menu,
  render: props => (
    <Menu {...props}>
      <Menu.Item>Menu 1</Menu.Item>
      <Menu.Item>Menu 2</Menu.Item>
    </Menu>
  ),
} satisfies Meta<typeof Menu>;

type Story = StoryObj<typeof Menu>;

export const Default: Story = {};
