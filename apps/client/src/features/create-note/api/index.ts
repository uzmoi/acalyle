import { Result } from "@acalyle/fp";
import type { BookId } from "~/entities/book";
import type { Note, NoteId, NoteTagString } from "~/entities/note";
import { gql, type ID, type GqlFnError } from "~/shared/graphql";
import CreateNoteMutation from "./create-note.graphql";
import NoteTemplateQuery from "./note-template.graphql";

export const fetchTemplate = async (
  bookId: BookId,
): Promise<Result<readonly string[], GqlFnError>> => {
  const result = await gql(NoteTemplateQuery, {
    bookId: bookId as string as ID,
  });

  return result.flatMap(data =>
    data.book == null ?
      Result.err({ name: "NotFoundError" })
    : Result.ok(data.book.tagProps),
  );
};

export const createNoteMutation = async (
  bookId: BookId,
  templateName?: string,
): Promise<Result<Note, GqlFnError>> => {
  const result = await gql(CreateNoteMutation, {
    bookId: bookId as string as ID,
    templateName,
  });

  return result.map(data => {
    const note = data.createMemo;

    return {
      id: note.id as string as NoteId,
      contents: note.contents,
      tags: note.tags as NoteTagString[],
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
    };
  });
};
