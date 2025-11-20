import { faker } from "@faker-js/faker";
import { noop } from "es-toolkit";
import preview from "~/../.storybook/preview";
import { createRandomBook } from "~/entities/book/dev";
import { BookListPage } from "./page";

const meta = preview.meta({
  component: BookListPage,
  parameters: { layout: "fullscreen" },
});

export const Default = meta.story({
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
    } satisfies React.ComponentProps<typeof BookListPage>,
  }),
  args: {
    fetchingPage: new Promise(noop),
  },
});

export const Loading = meta.story({
  args: {
    fetchingPage: new Promise(noop),
  },
});

export const LoadingError = meta.story({
  args: {
    fetchingPage: Promise.reject(new Error("Error")),
  },
});
