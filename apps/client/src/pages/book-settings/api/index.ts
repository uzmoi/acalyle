import { Result } from "@acalyle/fp";
import type { BookId, BookHandle } from "~/entities/book";
import { type ID, gql, type GqlFnError } from "~/shared/graphql";
import ChangeBookDescriptionMutation from "./change-book-description.graphql";
import ChangeBookHandleMutation from "./change-book-handle.graphql";
import ChangeBookTitleMutation from "./change-book-title.graphql";

export const changeBookTitleMutation = async (
  id: BookId,
  title: string,
): Promise<Result<string, GqlFnError>> => {
  const result = await gql(ChangeBookTitleMutation, {
    bookId: id as string as ID,
    title,
  });

  return result.flatMap(({ updateBookTitle: book }) =>
    book == null ?
      Result.err({ name: "NotFoundError" })
    : Result.ok(book.title),
  );
};

export const changeBookHandleMutation = async (
  id: BookId,
  handle: BookHandle | null,
): Promise<Result<BookHandle | null, GqlFnError>> => {
  const result = await gql(ChangeBookHandleMutation, {
    bookId: id as string as ID,
    handle,
  });

  return result.flatMap(({ updateBookHandle: book }) =>
    book == null ?
      Result.err({ name: "NotFoundError" })
    : Result.ok(book.handle as BookHandle),
  );
};

export const changeBookDescriptionMutation = async (
  id: BookId,
  description: string,
): Promise<Result<string, GqlFnError>> => {
  const result = await gql(ChangeBookDescriptionMutation, {
    bookId: id as string as ID,
    description,
  });

  return result.flatMap(({ updateBookDescription: book }) =>
    book == null ?
      Result.err({ name: "NotFoundError" })
    : Result.ok(book.description),
  );
};
