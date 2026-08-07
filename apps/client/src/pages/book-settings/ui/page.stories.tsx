import preview from "~/../.storybook/preview";
import { createRandomBook, dummyBook } from "~/entities/book/dev";
import { BookSettingsPage } from "./page";

const meta = preview.meta({
  component: BookSettingsPage,
});

export const Default = meta.story({
  loaders: () => ({
    args: { book: createRandomBook() },
  }),
  args: { book: dummyBook },
});
