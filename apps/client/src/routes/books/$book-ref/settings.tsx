import { createFileRoute, useParams } from "@tanstack/react-router";
import { type BookRef, useBookByRef } from "~/entities/book";
import {
  BookDescriptionForm,
  BookHandleForm,
  BookTitleForm,
} from "~/features/book-settings";

const RouteComponent: React.FC = () => {
  const { "book-ref": bookRef } = useParams({ from: Route.fullPath });
  const book = useBookByRef(bookRef as BookRef);

  if (book == null) return null;

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

// eslint-disable-next-line pure-module/pure-module
export const Route = createFileRoute("/books/$book-ref/settings")({
  component: RouteComponent,
});
