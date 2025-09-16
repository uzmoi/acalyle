import type { Result } from "@uzmoi/ut/fp";
import type { BookId } from "~/entities/book";
import { $note, type NoteId } from "~/entities/note";
import type { GqlFnError } from "~/shared/graphql";
import { createNoteMutation } from "../api";

export const createNote = async (
  bookId: BookId,
  templateName?: string,
): Promise<Result<NoteId, GqlFnError>> => {
  const result = await createNoteMutation(bookId, templateName);

  if (result.ok) {
    const note = result.value;
    $note(note.id).resolve(note);
  }

  return result.map(noe => noe.id);
};
