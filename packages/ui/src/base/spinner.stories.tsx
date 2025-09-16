import type { Meta, StoryObj } from "@storybook/react-vite";
import { Spinner } from "./spinner";

export default {
  component: Spinner,
} satisfies Meta<typeof Spinner>;

type Story = StoryObj<typeof Spinner>;

export const Default: Story = {
  decorators: [story => <div style={{ "--size": "2em" }}>{story()}</div>],
};
