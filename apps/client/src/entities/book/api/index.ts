import type { ResultOf } from "@graphql-typed-document-node/core";
import type { Result } from "@uzmoi/ut/fp";
import { type ID, gql, type GqlFnError } from "~/shared/graphql";
import type { Book, BookHandle, BookId } from "../model";
import BookQuery from "./book.graphql";

const adjustType = (book: ResultOf<typeof BookQuery>["book"]): Book | null => {
  if (book == null) return null;

  return {
    id: book.id as string as BookId,
    handle: book.handle as BookHandle | null,
    title: book.title,
    description: book.description,
    thumbnail: book.thumbnail,
  };
};

export const fetchBook = async (
  id: BookId,
): Promise<Result<Book | null, GqlFnError>> => {
  const result = await gql(BookQuery, { bookId: id as string as ID });

  return result.map(({ book }) => adjustType(book));
};

export const fetchBookByHandle = async (
  handle: BookHandle,
): Promise<Result<Book | null, GqlFnError>> => {
  const result = await gql(BookQuery, { handle });

  return result.map(({ book }) => adjustType(book));
};
