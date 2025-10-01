import { cx, style } from "@acalyle/css";
import { Intersection } from "@acalyle/ui";
import { useCallback } from "react";
import type { Book } from "~/entities/book";
import { $noteConnection } from "~/features/search-notes";
import { useConnection } from "~/shared/graphql";
import { rebrand } from "~/shared/utils";
import { NoteWarpListItem } from "./wrap-list-item";

export const NoteWarpList: React.FC<{
  book: Book;
  query: string;
}> = ({ book, query }) => {
  const { nodeIds } = useConnection($noteConnection(book.id, query));

  const onIntersection = useCallback(
    (entry: IntersectionObserverEntry) => {
      if (entry.isIntersecting) {
        void $noteConnection(book.id, query).loadNextPage();
      }
    },
    [book.id, query],
  );

  return (
    <div>
      <div
        className={cx(
          ":uno: grid gap-y-4 gap-x-5 grid-auto-rows-48",
          style({
            gridTemplateColumns: "repeat(auto-fill, minmax(24em, 1fr))",
          }),
        )}
      >
        {nodeIds.map(noteId => (
          <NoteWarpListItem key={noteId} book={book} noteId={rebrand(noteId)} />
        ))}
      </div>
      <Intersection onIntersection={onIntersection} rootMargin="25% 0px" />
    </div>
  );
};
