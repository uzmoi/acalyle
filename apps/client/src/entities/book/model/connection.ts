import type { ResultOf } from "@graphql-typed-document-node/core";
import { type Cursor, GraphqlConnection, gql } from "~/shared/graphql";
import BookPaginationQuery from "../api/book-pagination.graphql";
import { $book } from "./store";
import type { BookHandle, BookId } from "./types";

type BookPage = ResultOf<typeof BookPaginationQuery>["books"];
type BookNode = BookPage["edges"][number]["node"];

export class BookConnection extends GraphqlConnection<BookNode> {
  constructor(readonly query: string) {
    super();
  }
  protected async fetchPage(
    cursor: Cursor | null,
    _dir: "previous" | "next",
  ): Promise<BookPage> {
    const result = await gql(BookPaginationQuery, {
      count: 32,
      cursor,
      query: this.query, // `orderby:updated order:desc ${query}`
    });
    return result.unwrap().books;
  }
  protected updateNodes(nodes: readonly BookNode[]): void {
    for (const book of nodes) {
      $book(book.id as string as BookId).resolve({
        ...book,
        id: book.id as string as BookId,
        handle: book.handle as BookHandle | null,
      });
    }
  }
}

const connectionMap = new Map<string, BookConnection>();

export const $bookConnection = (query: string): BookConnection => {
  const entry = connectionMap.get(query);

  if (entry != null) return entry;

  const conn = new BookConnection(query);

  connectionMap.set(query, conn);

  return conn;
};
