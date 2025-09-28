import type { TagSymbol } from "@acalyle/core";
import type { ResultOf } from "@graphql-typed-document-node/core";
import type { Result } from "@uzmoi/ut/fp";
import { type GqlFnError, type ID, gql } from "~/shared/graphql";
import type {
  Book,
  BookDetail,
  BookHandle,
  BookId,
  NoteTagMetadata,
} from "../model";
import BookDetailQuery from "./book-detail.graphql";
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

export const fetchBookDetail = async (
  id: BookId,
): Promise<Result<BookDetail | null, GqlFnError>> => {
  const result = await gql(BookDetailQuery, { bookId: id as string as ID });

  return result.map(({ book }) => {
    if (book == null) return null;
    return {
      tags: new Map<TagSymbol, NoteTagMetadata>(
        new Set(book.tags)
          .values()
          .map(tag => [
            tag as TagSymbol,
            { symbol: tag as TagSymbol, props: new Set(), description: "" },
          ]),
      ),
      createdAt: book.createdAt,
    };
  });
};
