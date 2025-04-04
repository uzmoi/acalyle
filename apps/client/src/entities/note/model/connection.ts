import type { ResultOf } from "@graphql-typed-document-node/core";
import type { BookId } from "~/entities/book";
import { gql, type Cursor, GraphqlConnection, type ID } from "~/shared/graphql";
import NotePaginationQuery from "../api/note-pagination.graphql";
import { $note } from "./store";
import type { NoteId, NoteTagString } from "./types";

type NotePage = NonNullable<
  ResultOf<typeof NotePaginationQuery>["book"]
>["memos"];
type NoteNode = NotePage["edges"][number]["node"];

export class NoteConnection extends GraphqlConnection<NoteNode> {
  constructor(
    readonly bookId: BookId,
    readonly query: string,
  ) {
    super();
  }
  protected async fetchPage(
    cursor: Cursor | null,
    _dir: "previous" | "next",
  ): Promise<NotePage> {
    const result = await gql(NotePaginationQuery, {
      count: 32,
      cursor,
      bookId: this.bookId as string as ID,
      query: this.query,
    });
    // FIXME: non-null ではない
    return result.unwrapOrThrow().book!.memos;
  }
  protected updateNodes(nodes: readonly NoteNode[]): void {
    for (const note of nodes) {
      $note(note.id as string as NoteId).resolve({
        ...note,
        id: note.id as string as NoteId,
        tags: note.tags as NoteTagString[],
      });
    }
  }
}

const connectionMap = new Map<`${BookId}/${string}`, NoteConnection>();

export const $noteConnection = (
  bookId: BookId,
  query: string,
): NoteConnection => {
  const key = `${bookId}/${query}` as const;
  const entry = connectionMap.get(key);

  if (entry != null) return entry;

  const conn = new NoteConnection(bookId, query);

  connectionMap.set(key, conn);

  return conn;
};
