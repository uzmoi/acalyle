import type { ResultOf } from "@graphql-typed-document-node/core";
import type { Result } from "@uzmoi/ut/fp";
import type { TagMetadata, TagSymbol } from "~/entities/tag";
import { type GqlFnError, gql } from "~/shared/graphql";
import { rebrand } from "~/shared/utils";
import type { Book, BookDetail, BookHandle, BookId } from "../model";
import BookDetailQuery from "./book-detail.graphql";
import BookQuery from "./book.graphql";

const adjustType = (book: ResultOf<typeof BookQuery>["book"]): Book | null => {
  if (book == null) return null;

  return {
    id: rebrand(book.id),
    handle: rebrand(book.handle),
    title: book.title,
    description: book.description,
    thumbnail: book.thumbnail,
  };
};

export const fetchBook = async (
  id: BookId,
): Promise<Result<Book | null, GqlFnError>> => {
  const result = await gql(BookQuery, { bookId: rebrand(id) });

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
  const result = await gql(BookDetailQuery, { bookId: rebrand(id) });

  return result.map(({ book }): BookDetail | null => {
    if (book == null) return null;
    return {
      tags: new Map(
        new Set(book.tags).values().map(tag => {
          const metadata: TagMetadata = {
            symbol: tag as TagSymbol,
            props: new Set(tag === "@template" ? book.templates : undefined),
            description: "",
          };
          return [metadata.symbol, metadata];
        }),
      ),
      createdAt: book.createdAt,
    };
  });
};
