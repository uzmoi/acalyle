import type { Book } from "#entities/book";
import { BookPagesHeader } from "#widgets/book-pages-header";
import { BookDescriptionForm } from "./book-desc-form";
import { BookHandleForm } from "./book-handle-form";
import { BookTitleForm } from "./book-title-form";

export const BookSettingsPage: React.FC<{
  book: Book;
}> = ({ book }) => {
  return (
    <main className=":uno: mx-auto max-w-screen-xl px-8 py-4 flex flex-col gap-4">
      <BookPagesHeader book={book} />
      <BookTitleForm bookId={book.id} currentTitle={book.title} />
      <BookHandleForm bookId={book.id} currentHandle={book.handle} />
      <BookDescriptionForm
        bookId={book.id}
        currentDescription={book.description}
      />
    </main>
  );
};
