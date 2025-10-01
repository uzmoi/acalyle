import { Err, Ok, type Result } from "@uzmoi/ut/fp";
import type { BookId } from "~/entities/book";
import type { Note } from "~/entities/note";
import { type GqlFnError, gql } from "~/shared/graphql";
import { rebrand } from "~/shared/utils";
import CreateNoteMutation from "./create-note.graphql";
import NoteTemplateQuery from "./note-template.graphql";

export const fetchTemplate = async (
  bookId: BookId,
): Promise<Result<readonly string[], GqlFnError>> => {
  const result = await gql(NoteTemplateQuery, { bookId: rebrand(bookId) });

  if (!result.ok) return result;
  const { book } = result.value;

  if (book == null) {
    return Err({ name: "NotFoundError" });
  }

  return Ok(book.tagProps);
};

export const createNoteMutation = async (
  bookId: BookId,
  templateName?: string,
): Promise<Result<Note, GqlFnError>> => {
  const result = await gql(CreateNoteMutation, {
    bookId: rebrand(bookId),
    templateName,
  });

  return result.map(({ createMemo: note }) => ({
    id: rebrand(note.id),
    contents: note.contents,
    tags: rebrand(note.tags),
    createdAt: note.createdAt,
    updatedAt: note.updatedAt,
  }));
};
