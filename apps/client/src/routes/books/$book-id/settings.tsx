import { createFileRoute, useParams } from "@tanstack/react-router";
import {
  BookDescriptionForm,
  BookHandleForm,
  BookTitleForm,
} from "~/features/book-settings";
import { useBook } from "~/store/hook";

const RouteComponent: React.FC = () => {
  const { "book-id": bookRef } = useParams({ from: Route.fullPath });
  const book = useBook(bookRef);

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
export const Route = createFileRoute("/books/$book-id/settings")({
  component: RouteComponent,
});
