import {
  Link,
  Outlet,
  createFileRoute,
  useParams,
} from "@tanstack/react-router";
import { useBook } from "~/store/hook";

const LayoutComponent: React.FC = () => {
  const { "book-id": bookRef } = useParams({ from: Route.fullPath });
  const book = useBook(bookRef);

  if (book == null) {
    return (
      <div className=":uno: px-8 py-4 text-center">
        <p>Book {bookRef} not found</p>
        <Link to="/books">Return /books</Link>
      </div>
    );
  }

  return (
    <div className=":uno: px-8 py-4">
      <h1>{book.title}</h1>
      <p className=":uno: text-xs">{book.description}</p>
      <hr className=":uno: my-2 border-gray-7 border-none border-t-solid" />
      <Outlet />
    </div>
  );
};

export const Route = /* #__PURE__ */ createFileRoute("/books/$book-id")({
  component: LayoutComponent,
});
