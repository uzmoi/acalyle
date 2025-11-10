import type { BookId } from "~/entities/book";
import { $note } from "~/entities/note";
import { type Cursor, GraphqlConnection } from "~/shared/graphql";
import { rebrand } from "~/shared/utils";
import { type NotePage, fetchNotePagination } from "../api";
import { parseQuery, printServerQuery } from "./query";

type NoteNode = NotePage["nodes"][number];

export class NoteConnection extends GraphqlConnection<NoteNode> {
  constructor(
    readonly bookId: BookId,
    readonly query: string,
  ) {
    super();
  }
  protected async fetchPage(
    cursor: Cursor | null,
    dir: "previous" | "next",
  ): Promise<NotePage> {
    const result = await fetchNotePagination(
      this.bookId,
      cursor,
      this.query,
      dir,
    );
    // FIXME: non-null ではない
    return result.unwrap()!;
  }
  // oxlint-disable-next-line class-methods-use-this
  protected updateNodes(nodes: readonly NoteNode[]): void {
    for (const note of nodes) {
      $note(rebrand(note.id)).resolve({
        ...note,
        id: rebrand(note.id),
        tags: rebrand(note.tags),
      });
    }
  }
}

const connectionMap = new Map<`${BookId}/${string}`, NoteConnection>();

export const $noteConnection = (
  bookId: BookId,
  query: string,
): NoteConnection => {
  const serverQuery = printServerQuery(parseQuery(query).toArray());
  const key = `${bookId}/${serverQuery}` as const;
  const entry = connectionMap.get(key);

  if (entry != null) return entry;

  const conn = new NoteConnection(bookId, serverQuery);

  connectionMap.set(key, conn);

  return conn;
};
