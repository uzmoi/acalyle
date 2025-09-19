import type { Meta, StoryObj } from "@storybook/react";
import { createRandomBook, defaultBook } from "~/entities/book/dev";
import { BookSettingsPage } from "./page";

const meta = {
  component: BookSettingsPage,
} satisfies Meta<typeof BookSettingsPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  loaders: () => ({
    args: { book: createRandomBook() },
  }),
  args: { book: defaultBook },
};
