import { createModal } from "@acalyle/ui";
import type { BookRef } from "~/entities/book";
import type { NoteId } from "~/entities/note";

export interface NoteModalInput {
  bookRef: BookRef;
  noteId: NoteId;
}

export const modal = /* #__PURE__ */ createModal<NoteModalInput>();

export const open = async (bookRef: BookRef, noteId: NoteId): Promise<void> => {
  await modal.open({ bookRef, noteId });
};

export const close = (): void => {
  void modal.close();
};
