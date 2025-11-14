import type { Book } from "~/entities/book";
import { type Cursor, gql } from "~/shared/graphql";
import { rebrand } from "~/shared/utils";
import { BOOKS_PER_PAGE } from "../model";
import BackwardBookPaginationQuery from "./backward-book-pagination.graphql";
import ForwardBookPaginationQuery from "./forward-book-pagination.graphql";

export interface BooksPage {
  books: Book[];
  pageInfo: {
    hasPreviousPage: boolean;
    hasNextPage: boolean;
    startCursor: string | null;
    endCursor: string | null;
  };
}

export const fetchBooksPage = async (
  query: string,
  cursor: Cursor | null,
  dir: "forward" | "backward",
): Promise<BooksPage> => {
  const Query = {
    forward: ForwardBookPaginationQuery,
    backward: BackwardBookPaginationQuery,
  }[dir];

  const result = await gql(Query, {
    count: BOOKS_PER_PAGE,
    cursor,
    query, // `orderby:updated order:desc ${query}`
  });

  const { edges, pageInfo } = result.unwrap().books;

  const books = edges.map((edge): Book => {
    const book = edge.node;
    return {
      id: rebrand(book.id),
      handle: rebrand(book.handle),
      title: book.title,
      description: book.description,
      thumbnail: book.thumbnail,
    };
  });

  return { books, pageInfo };
};
