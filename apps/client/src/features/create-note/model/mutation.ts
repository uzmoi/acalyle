import { acalyle } from "~/app/main";
import type { BookId } from "~/entities/book";
import { $note, type NoteId, type NoteTagString } from "~/entities/note";
import type { ID } from "~/lib/graphql";
import CreateNoteMutation from "../api/create-note.graphql";

export const createNote = async (bookId: BookId, templateName?: string) => {
  const gql = acalyle.net.gql.bind(acalyle.net);

  const { data } = await gql(CreateNoteMutation, {
    bookId: bookId as string as ID,
    templateName,
  });

  const note = data.createMemo;
  const noteId = note.id as string as NoteId;

  $note(noteId).resolve({
    id: noteId,
    contents: note.contents,
    tags: note.tags as NoteTagString[],
    createdAt: note.createdAt,
    updatedAt: note.updatedAt,
  });

  return noteId;
};
