import type { Result } from "@acalyle/fp";
import type { BookId, Book } from "~/entities/book";
import { gql, type GqlFnError } from "~/shared/graphql";
import CreateBookMutation from "./create-book.graphql";

export const createBookMutation = async (
  title: string,
  description: string,
): Promise<Result<Book, GqlFnError>> => {
  const result = await gql(CreateBookMutation, {
    title,
    description,
    // { "variables.thumbnail": thumbnail },
  });

  return result.map(({ createBook: book }) => ({
    id: book.id as string as BookId,
    handle: null,
    title,
    description,
    tags: [],
    thumbnail: book.thumbnail,
  }));
};
