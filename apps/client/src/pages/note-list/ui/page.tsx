import { useDeferredValue, useState } from "react";
import type { Book } from "#entities/book";
import { NoteCreateButton } from "#features/create-note";
import { NoteModalContainer } from "#features/note-modal";
import { SearchBox } from "#features/search-notes";
import { BookPagesHeader } from "#widgets/book-pages-header";
import { NoteWarpList } from "./warp-list";

export const NoteListPage: React.FC<{
  book: Book;
}> = ({ book }) => {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  return (
    <main className=":uno: mx-auto max-w-screen-xl px-8 py-4">
      <BookPagesHeader book={book} />
      <div className=":uno: my-4">
        <SearchBox bookId={book.id} query={query} setQuery={setQuery} />
        <NoteCreateButton book={book} />
      </div>
      <NoteWarpList book={book} query={`-@relate:* ${deferredQuery}`} />
      <NoteModalContainer />
    </main>
  );
};
