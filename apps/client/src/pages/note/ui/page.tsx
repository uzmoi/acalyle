import { Catch, Spacer } from "@acalyle/ui";
import { Suspense } from "react";
import type { Book } from "#entities/book";
import type { NoteId } from "#entities/note";
import { Alert, getErrorMessage } from "#widgets/alert";
import { BookPagesHeader } from "#widgets/book-pages-header";
import { Note } from "./note";

export const NotePage: React.FC<{
  book: Book;
  noteId: NoteId;
}> = ({ book, noteId }) => {
  return (
    <main className=":uno: mx-auto max-w-screen-xl px-8 py-4">
      <BookPagesHeader book={book} />
      <Spacer size={1} axis="horizontal" />
      <Suspense>
        <Catch
          fallback={error => (
            <Alert
              title="ノートを取得できませんでした。"
              detail={getErrorMessage(error)}
            />
          )}
        >
          <Note bookId={book.id} noteId={noteId} />
        </Catch>
      </Suspense>
    </main>
  );
};
