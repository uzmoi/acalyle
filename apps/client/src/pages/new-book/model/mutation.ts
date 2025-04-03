import type { Result } from "@acalyle/fp";
import { $book, type BookRef, bookRefFromId } from "~/entities/book";
import type { GqlFnError } from "~/shared/graphql";
import { createBookMutation } from "../api";

export const createBook = async (
  title: string,
  description: string,
): Promise<Result<BookRef, GqlFnError>> => {
  const result = await createBookMutation(title, description);

  return result.map(book => {
    $book(book.id).resolve(book);

    return bookRefFromId(book.id);
  });
};
