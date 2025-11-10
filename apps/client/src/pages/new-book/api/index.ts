import type { Result } from "@uzmoi/ut/fp";
import type { Book, BookHandle } from "~/entities/book";
import { type GqlFnError, gql } from "~/shared/graphql";
import { rebrand } from "~/shared/utils";
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
    id: rebrand(book.id),
    handle: null,
    title,
    description,
    tags: [],
    thumbnail: book.thumbnail,
  }));
};
