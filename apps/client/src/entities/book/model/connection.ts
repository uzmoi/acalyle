import type { ResultOf } from "@graphql-typed-document-node/core";
import { acalyle } from "~/app/main";
import { type Cursor, GraphqlConnection } from "~/shared/graphql";
import BookPaginationQuery from "../api/book-pagination.graphql";
import { $book } from "./store";
import type { BookId } from "./types";

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
    const gql = acalyle.net.gql.bind(acalyle.net);
    const { data } = await gql(BookPaginationQuery, {
      count: 32,
      cursor,
      query: this.query, // `orderby:updated order:desc ${query}`
    });
    return data.books;
  }
  protected updateNodes(nodes: readonly BookNode[]): void {
    for (const book of nodes) {
      $book(book.id as string as BookId).resolve({
        ...book,
        id: book.id as string as BookId,
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
