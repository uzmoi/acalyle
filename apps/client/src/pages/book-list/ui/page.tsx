import { Catch } from "@acalyle/ui";
import { Link } from "@tanstack/react-router";
import { Suspense } from "react";
import { BiBookAdd } from "react-icons/bi";
import type { GqlFnError } from "#shared/graphql";
import type { BooksPage } from "../api";
import { Alert } from "./alert";
import { SearchBar } from "./search-bar";
import { BookShelf } from "./shelf";
import { BookShelfSkeleton } from "./shelf-skeleton";

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error && error.cause) {
    const err = error.cause as GqlFnError;

    if (err.name === "NetworkError") {
      return "ネットワークエラーが発生しました。インターネット環境をご確認ください。";
    }
  }

  return "不明なエラーが発生しました。";
};

export const BookListPage: React.FC<{
  initialQuery?: string | undefined;
  fetchingPage: Promise<BooksPage>;
}> = ({ initialQuery, fetchingPage }) => {
  return (
    <main className=":uno: mx-auto max-w-screen-xl px-8 py-4">
      <div className=":uno: mb-6 flex flex-wrap items-center gap-x-4 gap-y-2">
        <SearchBar initialQuery={initialQuery} />
        <Link to="/books/new">
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
          <BookShelf fetchingBooks={fetchingPage.then(page => page.books)} />
        </Suspense>
      </Catch>
    </main>
  );
};
