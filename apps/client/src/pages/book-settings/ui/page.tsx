import type { Book } from "~/entities/book";
import { BookDescriptionForm } from "./book-desc-form";
import { BookHandleForm } from "./book-handle-form";
import { BookTitleForm } from "./book-title-form";

export const BookSettingsPage: React.FC<{
  book: Book;
}> = ({ book }) => {
  return (
    <div className=":uno: flex flex-col gap-4">
      <BookTitleForm bookId={book.id} currentTitle={book.title} />
      <BookHandleForm bookId={book.id} currentHandle={book.handle} />
      <BookDescriptionForm
        bookId={book.id}
        currentDescription={book.description}
      />
    </div>
  );
};
