import type { Result } from "@acalyle/fp";
import type { BookId } from "~/entities/book";
import { $note, type NoteId } from "~/entities/note";
import type { GqlFnError } from "~/shared/graphql";
import { createNoteMutation } from "../api";

export const createNote = async (
  bookId: BookId,
  templateName?: string,
): Promise<Result<NoteId, GqlFnError>> => {
  const result = await createNoteMutation(bookId, templateName);

  return result.map(note => {
    $note(note.id).resolve(note);

    return note.id;
  });
};
