import type { Result } from "@uzmoi/ut/fp";
import type { BookId, Book, BookHandle } from "~/entities/book";
import { gql, type GqlFnError } from "~/shared/graphql";
import CreateBookMutation from "./create-book.graphql";

export const createBookMutation = async (
  _handle: BookHandle | null,
  title: string,
  description: string,
): Promise<Result<Book, GqlFnError>> => {
  const result = await gql(CreateBookMutation, {
    // handle,
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
