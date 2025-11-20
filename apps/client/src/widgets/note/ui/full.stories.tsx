import type { BookId } from "#entities/book";
import preview from "~/../.storybook/preview";
import { createRandomNote, defaultNote } from "~/entities/note/dev";
import { FullNote } from "./full";

const meta = preview.meta({
  component: FullNote,
});

export const Default = meta.story({
  loaders: () => ({
    args: { note: createRandomNote() },
  }),
  args: {
    bookId: "id" as BookId,
    note: defaultNote,
  },
});
