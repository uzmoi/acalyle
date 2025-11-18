import {
  Outlet,
  createFileRoute,
  notFound,
  useLoaderData,
  useParams,
} from "@tanstack/react-router";
import { Link } from "#shared/ui";
import { type BookRef, fetchBookByRef } from "~/entities/book";
import { BookHeader } from "~/pages/book";

const LayoutComponent: React.FC = () => {
  const { book } = useLoaderData({ from: Route.fullPath });

  return (
    <main className=":uno: px-8 py-4">
      <BookHeader book={book} />
      <hr className=":uno: my-2 border-gray-7 border-none border-t-solid" />
      <Outlet />
    </main>
  );
};

const ErrorComponent: React.FC = () => {
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
  notFoundComponent: ErrorComponent,
  async loader({ params }) {
    const bookRef = params["book-ref"] as BookRef;
    const result = await fetchBookByRef(bookRef);
    // FIXME: unwrap
    const book = result.unwrap();
    if (book == null) {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw notFound();
    }
    return { book };
  },
});
