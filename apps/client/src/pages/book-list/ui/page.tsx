import { Catch } from "@acalyle/ui";
import { Suspense } from "react";
import { BiBookAdd } from "react-icons/bi";
import { Link } from "#shared/ui";
import { Alert, getErrorMessage } from "#widgets/alert";
import type { BooksPage as IBooksPage } from "../api";
import { BooksPage } from "./books-page";
import { SearchBar } from "./search-bar";
import { BookShelfSkeleton } from "./shelf-skeleton";

export const BookListPage: React.FC<{
  query?: string | undefined;
  fetchingPage: Promise<IBooksPage>;
}> = ({ query, fetchingPage }) => {
  return (
    <main className=":uno: mx-auto max-w-screen-xl px-8 py-4">
      <div className=":uno: mb-6 flex flex-wrap items-center gap-x-4 gap-y-2">
        <SearchBar initialQuery={query} />
        <Link to="/books/new" button>
          <BiBookAdd />
          <span className=":uno: ml-1">New</span>
        </Link>
      </div>
      <Catch
        fallback={error => (
          <Alert
            title="本の一覧を取得できませんでした。"
            detail={getErrorMessage(error)}
          />
        )}
      >
        <Suspense fallback={<BookShelfSkeleton />}>
          <BooksPage query={query} fetchingPage={fetchingPage} />
        </Suspense>
      </Catch>
    </main>
  );
};
