import type { Result } from "@uzmoi/ut/fp";
import { type BookRef, type BookHandle, bookRefFromId } from "~/entities/book";
import type { GqlFnError } from "~/shared/graphql";
import { createBookMutation } from "../api";

export const createBook = async (
  handle: BookHandle | null,
  title: string,
  description: string,
): Promise<Result<BookRef, GqlFnError>> => {
  const result = await createBookMutation(handle, title, description);

  return result.map(book => bookRefFromId(book.id));
};
