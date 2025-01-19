import { createFileRoute, useParams } from "@tanstack/react-router";
import type { BookId } from "~/entities/book";
import {
  BookDescriptionForm,
  BookHandleForm,
  BookTitleForm,
} from "~/features/book-settings";
import { useBook } from "~/store/hook";

const RouteComponent: React.FC = () => {
  const { "book-ref": bookRef } = useParams({ from: Route.fullPath });
  const book = useBook(bookRef);

  if (book == null) return null;

  return (
    <div>
      <BookTitleForm
        bookId={book.id as string as BookId}
        currentTitle={book.title}
      />
      <BookHandleForm
        bookId={book.id as string as BookId}
        currentHandle={book.handle}
      />
      <BookDescriptionForm
        bookId={book.id as string as BookId}
        currentDescription={book.description}
      />
    </div>
  );
};

// eslint-disable-next-line pure-module/pure-module
export const Route = createFileRoute("/books/$book-ref/settings")({
  component: RouteComponent,
});
