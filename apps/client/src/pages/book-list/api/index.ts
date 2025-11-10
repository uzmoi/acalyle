import type { Book } from "~/entities/book";
import { gql } from "~/shared/graphql";
import { rebrand } from "~/shared/utils";
import BookPaginationQuery from "./book-pagination.graphql";

export interface BooksPage {
  books: Book[];
  pageInfo: {
    hasPreviousPage: boolean;
    hasNextPage: boolean;
    startCursor: string | null;
    endCursor: string | null;
  };
}

export const fetchBooksPage = async (query: string): Promise<BooksPage> => {
  const result = await gql(BookPaginationQuery, {
    count: 32,
    // cursor,
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
