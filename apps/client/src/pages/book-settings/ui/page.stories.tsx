import preview from "~/../.storybook/preview";
import { createRandomBook, dummyBook } from "~/entities/book/dev";
import { BookSettingsPage } from "./page";

const meta = preview.meta({
  title: "pages/book-settings",
  component: BookSettingsPage,
});

export const Default = meta.story({
  loaders: () => ({
    args: { book: createRandomBook() },
  }),
  args: { book: dummyBook },
});
