import { cx, style } from "@acalyle/css";
import { Intersection } from "@acalyle/ui";
import { useCallback } from "react";
import { type BookRef, useBookByRef } from "~/entities/book";
import { $noteConnection, type NoteId, NoteOverview } from "~/entities/note";
import { MIN_NOTE_WIDTH } from "~/note/ui/constants";
import { useConnection } from "~/shared/graphql";

export const NoteWarpList: React.FC<{
  bookRef: BookRef;
  query: string;
}> = ({ bookRef, query }) => {
  // FIXME: non-null ではない
  const bookId = useBookByRef(bookRef)!.id;
  const { nodeIds } = useConnection($noteConnection(bookId, query));

  const onIntersection = useCallback(
    (entry: IntersectionObserverEntry) => {
      if (entry.isIntersecting) {
        void $noteConnection(bookId, query).loadNextPage();
      }
    },
    [bookId, query],
  );

  return (
    <div>
      <div
        className={cx(
          ":uno: grid gap-y-4 gap-x-5 grid-auto-rows-48",
          style({
            gridTemplateColumns: `repeat(auto-fill, minmax(${MIN_NOTE_WIDTH}, 1fr))`,
          }),
        )}
      >
        {nodeIds.map(noteId => (
          <NoteOverview
            key={noteId}
            bookId={bookId}
            noteId={noteId as string as NoteId}
          />
        ))}
      </div>
      <Intersection onIntersection={onIntersection} rootMargin="25% 0px" />
    </div>
  );
};
