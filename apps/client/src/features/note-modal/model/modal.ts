import { createModal } from "@acalyle/ui";
import type { BookId, BookRef } from "~/entities/book";
import type { NoteId } from "~/entities/note";

export interface NoteModalInput {
  bookRef: BookRef;
  bookId: BookId;
  noteId: NoteId;
}

export const modal = /* #__PURE__ */ createModal<NoteModalInput>();

export const open = async (
  bookRef: BookRef,
  bookId: BookId,
  noteId: NoteId,
): Promise<void> => {
  await modal.open({ bookRef, bookId, noteId });
};

export const close = (): void => {
  void modal.close();
};
