import type { Result } from "@acalyle/fp";
import { $book, type BookRef, bookRefFromId } from "~/entities/book";
import type { GqlFnError } from "~/shared/graphql";
import { createBookMutation } from "../api";

export const createBook = async (
  title: string,
  description: string,
): Promise<Result<BookRef, GqlFnError>> => {
  const result = await createBookMutation(title, description);

  if (result.ok) {
    const book = result.value;
    $book(book.id).resolve(book);
  }

  return result.map(book => bookRefFromId(book.id));
};
