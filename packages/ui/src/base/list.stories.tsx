import type { Meta, StoryObj } from "@storybook/react-vite";
import { List } from "./list";

const items = ["hoge", "fuga", "piyo"];

export default {
  component: List,
  render: props => (
    <List {...props}>
      {items.map(item => (
        <List.Item key={item}>{item}</List.Item>
      ))}
    </List>
  ),
} satisfies Meta<typeof List>;

type Story = StoryObj<typeof List>;

export const unordered: Story = {
  args: {
    ordered: false,
  },
};

export const ordered: Story = {
  args: {
    ordered: true,
  },
};
