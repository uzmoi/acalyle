import preview from "~/../.storybook/preview";
import { createRandomBook, defaultBook } from "~/entities/book/dev";
import { BookSettingsPage } from "./page";

const meta = preview.meta({
  component: BookSettingsPage,
});

export const Default = meta.story({
  loaders: () => ({
    args: { book: createRandomBook() },
  }),
  args: { book: defaultBook },
});
