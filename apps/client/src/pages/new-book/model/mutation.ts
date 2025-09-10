import type { Result } from "@uzmoi/ut/fp";
import { type BookRef, bookRefFromId } from "~/entities/book";
import type { GqlFnError } from "~/shared/graphql";
import { createBookMutation } from "../api";

export const createBook = async (
  title: string,
  description: string,
): Promise<Result<BookRef, GqlFnError>> => {
  const result = await createBookMutation(title, description);

  return result.map(book => bookRefFromId(book.id));
};
