import type { Result } from "@uzmoi/ut/fp";
import type { BookId } from "~/entities/book";
import type { Note } from "~/entities/note";
import { type GqlFnError, gql } from "~/shared/graphql";
import { rebrand } from "~/shared/utils";
import CreateNoteMutation from "./create-note.graphql";

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
