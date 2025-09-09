import {
  Link,
  Outlet,
  createFileRoute,
  notFound,
  useLoaderData,
  useParams,
} from "@tanstack/react-router";
import { type BookRef, $bookByRef } from "~/entities/book";
import { toPromise } from "~/lib/promise-loader";

const LayoutComponent: React.FC = () => {
  const { book } = useLoaderData({ from: Route.fullPath });

  return (
    <div className=":uno: px-8 py-4">
      <h1>{book.title}</h1>
      <p className=":uno: text-xs">{book.description}</p>
      <hr className=":uno: my-2 border-gray-7 border-none border-t-solid" />
      <Outlet />
    </div>
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
    const store = $bookByRef(bookRef);
    const book = await toPromise(store);
    if (book == null) {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw notFound();
    }
    return { book };
  },
});
