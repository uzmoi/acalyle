import { faker } from "@faker-js/faker";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { noop } from "es-toolkit";
import { createRandomBook } from "~/entities/book/dev";
import { BookListPage } from "./page";

const meta = {
  component: BookListPage,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof BookListPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  loaders: () => ({
    args: {
      page: Promise.resolve({
        books: faker.helpers.multiple(() => createRandomBook()),
        pageInfo: {},
      }),
    },
  }),
  args: {
    page: new Promise(noop),
  },
};

export const Loading: Story = {
  args: {
    page: new Promise(noop),
  },
};

export const LoadingError: Story = {
  args: {
    page: Promise.reject(new Error("Error")),
  },
};
