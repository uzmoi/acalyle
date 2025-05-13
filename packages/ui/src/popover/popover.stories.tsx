import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent } from "@storybook/test";
import { Button } from "../control";
import {
  Popover,
  closePopover,
  type PopoverContentProps,
  type PopoverProps,
} from ".";

export default {
  component: Popover,
  render: props => (
    <Popover onOpen={props.onOpen} onClose={props.onClose}>
      <Popover.Button aria-haspopup>open</Popover.Button>
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
    onOpen: fn(),
    onClose: fn(),
    closeOnClick: false,
  },
} satisfies Meta<PopoverProps & PopoverContentProps>;

type Story = StoryObj<PopoverProps & PopoverContentProps>;

export const Default: Story = {};

export const Opened: Story = {
  async play({ canvas, args }) {
    const button = canvas.getByRole("button");
    await userEvent.click(button);
    await expect(args.onOpen).toHaveBeenCalled();

    const content = await canvas.findByText("content");
    await expect(content).toBeVisible();

    await userEvent.click(content);
    await expect(args.onClose).not.toHaveBeenCalled();

    await expect(content).toBeVisible();
  },
};
