import { useDeferredValue, useState } from "react";
import type { BookRef } from "~/entities/book";
import { NoteCreateButton } from "~/features/create-note";
import { NoteModalContainer } from "~/features/note-modal";
import { SearchBox } from "~/features/search-notes";
import { NoteWarpList } from "./warp-list";

export const NoteListPage: React.FC<{
  bookRef: BookRef;
}> = ({ bookRef }) => {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  return (
    <div>
      <div className=":uno: mb-4 flex gap-4">
        <SearchBox query={query} setQuery={setQuery} />
        <NoteCreateButton bookRef={bookRef} />
      </div>
      <NoteWarpList bookRef={bookRef} query={`-@relate:* ${deferredQuery}`} />
      <NoteModalContainer />
    </div>
  );
};
