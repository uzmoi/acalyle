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
      fetchingPage: Promise.resolve({
        books: faker.helpers.multiple(() => createRandomBook()),
        pageInfo: {
          hasPreviousPage: true,
          startCursor: btoa("start"),
          hasNextPage: false,
          endCursor: null,
        },
      }),
    } satisfies Story["args"],
  }),
  args: {
    fetchingPage: new Promise(noop),
  },
};

export const Loading: Story = {
  args: {
    fetchingPage: new Promise(noop),
  },
};

export const LoadingError: Story = {
  args: {
    fetchingPage: Promise.reject(new Error("Error")),
  },
};
