import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../control";
import { Popover, closePopover } from "./popover";

export default {
  component: Popover,
  render: props => (
    <Popover>
      <Popover.Button>open</Popover.Button>
      <Popover.Content
        style={{ padding: "1em" }}
        closeOnClick={props.closeOnClick}
      >
        <p>content</p>
        <Button onClick={closePopover}>close</Button>
      </Popover.Content>
    </Popover>
  ),
  args: {
    closeOnClick: false,
  },
} satisfies Meta<typeof Popover.Content>;

type Story = StoryObj<typeof Popover>;

export const Default: Story = {};
