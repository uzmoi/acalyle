import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { FileInput } from "./file-input";

const meta: Meta<typeof FileInput> = {
  component: FileInput,
  args: {
    onChange: fn(),
    onFileChange: fn<[File | FileList]>(),
  },
};

export default meta;

type Story = StoryObj<typeof FileInput>;

export const Single: Story = {
  args: {},
};

export const Multi: Story = {
  args: {
    multiple: true,
  },
};
