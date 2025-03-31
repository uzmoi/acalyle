import { acalyle } from "~/app/main";
import type { BookId } from "~/entities/book";
import type { Note, NoteId, NoteTagString } from "~/entities/note";
import type { ID } from "~/shared/graphql";
import CreateNoteMutation from "./create-note.graphql";
import NoteTemplateQuery from "./note-template.graphql";

export const fetchTemplate = async (
  bookId: BookId,
): Promise<readonly string[]> => {
  const gql = acalyle.net.gql.bind(acalyle.net);

  const { data } = await gql(NoteTemplateQuery, {
    bookId: bookId as string as ID,
  });

  return data.book?.tagProps ?? [];
};

export const createNoteMutation = async (
  bookId: BookId,
  templateName?: string,
): Promise<Note> => {
  const gql = acalyle.net.gql.bind(acalyle.net);

  const { data } = await gql(CreateNoteMutation, {
    bookId: bookId as string as ID,
    templateName,
  });

  const note = data.createMemo;

  return {
    id: note.id as string as NoteId,
    contents: note.contents,
    tags: note.tags as NoteTagString[],
    createdAt: note.createdAt,
    updatedAt: note.updatedAt,
  };
};
