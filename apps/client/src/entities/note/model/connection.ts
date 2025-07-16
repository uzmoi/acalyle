import type { BookId } from "~/entities/book";
import { type Cursor, GraphqlConnection } from "~/shared/graphql";
import { fetchNotePagination, type NotePage } from "../api";
import { $note } from "./store";
import type { NoteId, NoteTagString } from "./types";

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
