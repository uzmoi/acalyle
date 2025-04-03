import {
  Link,
  Outlet,
  createFileRoute,
  useParams,
} from "@tanstack/react-router";
import { type BookRef, useBookByRef } from "~/entities/book";

const LayoutComponent: React.FC = () => {
  const { "book-ref": bookRef } = useParams({ from: Route.fullPath });
  const book = useBookByRef(bookRef as BookRef);

  return (
    <div className=":uno: px-8 py-4">
      <h1>{book.title}</h1>
      <p className=":uno: text-xs">{book.description}</p>
      <hr className=":uno: my-2 border-gray-7 border-none border-t-solid" />
      <Outlet />
    </div>
  );
};

const ErrorComponent = () => {
  const { "book-ref": bookRef } = useParams({ from: Route.fullPath });

  return (
    <div className=":uno: px-8 py-4 text-center">
      <p>Book {bookRef} not found</p>
      <Link to="/books">Return /books</Link>
    </div>
  );
};

export const Route = /* #__PURE__ */ createFileRoute("/books/$book-ref")({
  component: LayoutComponent,
  errorComponent: ErrorComponent,
});
