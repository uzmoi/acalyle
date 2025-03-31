import type { BookId } from "~/entities/book";
import { $note, type NoteId } from "~/entities/note";
import { createNoteMutation } from "../api";

export const createNote = async (
  bookId: BookId,
  templateName?: string,
): Promise<NoteId> => {
  const note = await createNoteMutation(bookId, templateName);

  $note(note.id).resolve(note);

  return note.id;
};
