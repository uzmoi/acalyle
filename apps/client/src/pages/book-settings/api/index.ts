import { Err, Ok, type Result } from "@uzmoi/ut/fp";
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

  if (!result.ok) return result;
  const book = result.value.updateBookTitle;

  return book == null ? Err({ name: "NotFoundError" }) : Ok(book.title);
};

export const changeBookHandleMutation = async (
  id: BookId,
  handle: BookHandle | null,
): Promise<Result<BookHandle | null, GqlFnError>> => {
  const result = await gql(ChangeBookHandleMutation, {
    bookId: id as string as ID,
    handle,
  });

  if (!result.ok) return result;
  const book = result.value.updateBookHandle;

  return book == null ?
      Err({ name: "NotFoundError" })
    : Ok(book.handle as BookHandle);
};

export const changeBookDescriptionMutation = async (
  id: BookId,
  description: string,
): Promise<Result<string, GqlFnError>> => {
  const result = await gql(ChangeBookDescriptionMutation, {
    bookId: id as string as ID,
    description,
  });

  if (!result.ok) return result;
  const book = result.value.updateBookDescription;

  return book == null ? Err({ name: "NotFoundError" }) : Ok(book.description);
};
