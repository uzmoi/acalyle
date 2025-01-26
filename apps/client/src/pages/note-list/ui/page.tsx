import { cx, style } from "@acalyle/css";
import { Intersection, TextInput } from "@acalyle/ui";
import { useCallback, useDeferredValue, useState } from "react";
import { type BookRef, useBookByRef } from "~/entities/book";
import { $noteConnection, type NoteId, NoteOverview } from "~/entities/note";
import { NoteModalContainer } from "~/features/note-modal";
import { MIN_NOTE_WIDTH } from "~/note/ui/constants";
import { useConnection } from "~/shared/graphql";
import { CreateMemoButton } from "~/ui/CreateMemoButton";

export const NoteListPage: React.FC<{
  bookRef: BookRef;
}> = ({ bookRef }) => {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  // FIXME: non-null ではない
  const bookId = useBookByRef(bookRef)!.id;
  const { nodeIds } = useConnection(
    $noteConnection(bookId, `-@relate:* ${deferredQuery}`),
  );

  const onIntersection = useCallback(
    (entry: IntersectionObserverEntry) => {
      if (entry.isIntersecting) {
        void $noteConnection(
          bookId,
          `-@relate:* ${deferredQuery}`,
        ).loadNextPage();
      }
    },
    [bookId, deferredQuery],
  );

  return (
    <div>
      <div className=":uno: mb-4 flex gap-4">
        <TextInput
          type="search"
          className=":uno: flex-1"
          onValueChange={setQuery}
        />
        <CreateMemoButton bookHandle={bookRef} />
      </div>
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
      <NoteModalContainer />
    </div>
  );
};
