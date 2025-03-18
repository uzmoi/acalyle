import { type BookRef, useBookByRef } from "~/entities/book";
import { BookDescriptionForm } from "./book-desc-form";
import { BookHandleForm } from "./book-handle-form";
import { BookTitleForm } from "./book-title-form";

export const BookSettingsPage: React.FC<{
  bookRef: BookRef;
}> = ({ bookRef }) => {
  const book = useBookByRef(bookRef);

  return (
    <div>
      <BookTitleForm bookId={book.id} currentTitle={book.title} />
      <BookHandleForm bookId={book.id} currentHandle={book.handle} />
      <BookDescriptionForm
        bookId={book.id}
        currentDescription={book.description}
      />
    </div>
  );
};
