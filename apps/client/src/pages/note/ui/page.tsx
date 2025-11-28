import { Catch, Spacer } from "@acalyle/ui";
import { Suspense } from "react";
import type { Book } from "#entities/book";
import type { NoteId } from "#entities/note";
import type { GqlFnError } from "#shared/graphql";
import { Alert } from "#widgets/alert";
import { BookPagesHeader } from "#widgets/book-pages-header";
import { Note } from "./note";

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error && error.cause) {
    const err = error.cause as GqlFnError;

    if (err.name === "NetworkError") {
      return "ネットワークエラーが発生しました。インターネット環境をご確認ください。";
    }
  }

  return "不明なエラーが発生しました。";
};

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
