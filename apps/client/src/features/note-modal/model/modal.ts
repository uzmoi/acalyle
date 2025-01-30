import { Modal } from "@acalyle/ui";
import type { BookId } from "~/entities/book";
import type { NoteId } from "~/entities/note";

export interface NoteModalInput {
  bookId: BookId;
  noteId: NoteId;
}

export const modal = /* #__PURE__ */ Modal.create<NoteModalInput>();

export const open = async (bookId: BookId, noteId: NoteId): Promise<void> => {
  await modal.open({ bookId, noteId });
};

export const close = () => {
  void modal.close();
};
