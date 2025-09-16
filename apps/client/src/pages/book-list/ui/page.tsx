import { Link } from "@tanstack/react-router";
import { Suspense } from "react";
import { BiBookAdd } from "react-icons/bi";
import type { BooksPage } from "../api";
import { SearchBar } from "./search-bar";
import { BookShelf } from "./shelf";
import { BookShelfSkeleton } from "./shelf-skeleton";

export const BookListPage: React.FC<{
  initialQuery?: string | undefined;
  page: Promise<BooksPage>;
}> = ({ initialQuery, page }) => {
  return (
    <main className=":uno: mx-auto max-w-screen-xl px-8 py-4">
      <div className=":uno: mb-6 flex items-center gap-4">
        <SearchBar initialQuery={initialQuery} />
        <Link to="/books/new">
          <BiBookAdd />
          <span className=":uno: ml-1">New</span>
        </Link>
      </div>
      <Suspense fallback={<BookShelfSkeleton />}>
        <BookShelf books={page.then(page => page.books)} />
      </Suspense>
      {/* {error && (
        <Alert type="error">
          <BiError
            className={style({
              color: vars.color.danger,
              fontSize: "1.75em",
              marginRight: "0.25em",
            })}
          />
          <span className=":uno: align-middle">Failed to load books.</span>
          <p>error code: {error.type}</p>
          {error.type === "http_error" && <p>status: {error.status}</p>}
        </Alert>
      )} */}
    </main>
  );
};
