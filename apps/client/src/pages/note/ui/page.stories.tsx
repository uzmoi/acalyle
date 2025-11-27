import { noop } from "es-toolkit";
import { mocked } from "storybook/test";
import { createRandomBook, defaultBook } from "#entities/book/dev";
import type { NoteId } from "#entities/note";
import { createRandomNote } from "#entities/note/dev";
import preview from "~/../.storybook/preview";
import { NotePage } from "./page";

const meta = preview.meta({
  component: NotePage,
  parameters: { layout: "fullscreen" },
  async beforeEach() {
    const { useNote } = await import("#entities/note");
    const note = createRandomNote();
    mocked(useNote).mockImplementation(id => {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      if (id === "id-loading") throw new Promise(noop);
      if (id === "id-error") throw new Error("mock");
      return note;
    });
  },
});

export const Default = meta.story({
  loaders: () => ({
    args: { book: createRandomBook() },
  }),
  args: {
    book: defaultBook,
    noteId: "id-default" as NoteId,
  },
});

export const Loading = Default.extend({
  args: { noteId: "id-loading" as NoteId },
});

export const LoadingError = Default.extend({
  args: { noteId: "id-error" as NoteId },
});
