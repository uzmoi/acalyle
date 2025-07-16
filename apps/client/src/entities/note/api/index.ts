import type { Result } from "@acalyle/fp";
import type { ResultOf } from "@graphql-typed-document-node/core";
import type { BookId } from "~/entities/book";
import { gql, type GqlFnError, type Cursor, type ID } from "~/shared/graphql";
import type { Note, NoteId, NoteTagString } from "../model";
import AfterNotesPageQuery from "./after-notes-page.graphql";
import BeforeNotesPageQuery from "./before-notes-page.graphql";
import NoteQuery from "./note.graphql";

export type NotePage = NonNullable<
  ResultOf<typeof AfterNotesPageQuery>["book"]
>["memos"];

export const fetchNotePagination = async (
  bookId: BookId,
  cursor: Cursor | null,
  query: string,
  dir: "previous" | "next",
): Promise<Result<NotePage | undefined, GqlFnError>> => {
  const graphqlQuery =
    dir === "previous" ? BeforeNotesPageQuery : AfterNotesPageQuery;

  const result = await gql(graphqlQuery, {
    bookId: bookId as string as ID,
    cursor,
    count: 32,
    query,
  });

  return result.map(({ book }) => book?.memos);
};

export const fetchNote = async (id: NoteId): Promise<Note | null> => {
  const result = await gql(NoteQuery, { noteId: id as string as ID });
  const note = result.unwrap().memo;

  if (note == null) return null;

  return {
    id: note.id as string as NoteId,
    contents: note.contents,
    tags: note.tags as NoteTagString[],
    createdAt: note.createdAt,
    updatedAt: note.updatedAt,
  };
};
