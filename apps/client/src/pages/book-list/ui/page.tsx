import { Button, ControlGroup, TextInput } from "@acalyle/ui";
import { Link, useRouter } from "@tanstack/react-router";
import { startTransition, Suspense, useCallback } from "react";
import { BiBookAdd, BiRefresh } from "react-icons/bi";
import type { BooksPage } from "../api";
import { BookShelf } from "./shelf";
import { BookShelfSkeleton } from "./shelf-skeleton";

export const BookListPage: React.FC<{
  initialQuery?: string | undefined;
  page: Promise<BooksPage>;
}> = ({ initialQuery, page }) => {
  const router = useRouter();
  const setQuery = (query: string): void => {
    startTransition(async () => {
      await router.navigate({ to: "/books", search: { query } });
    });
  };

  const refetch = useCallback(() => {
    void router.invalidate();
  }, [router]);

  return (
    <main className=":uno: mx-auto max-w-screen-xl px-8 py-4">
      <div className=":uno: mb-6 flex items-center gap-4">
        <form action={refetch} className=":uno: flex-1">
          <ControlGroup className=":uno: flex">
            <TextInput
              type="search"
              className=":uno: flex-1"
              placeholder="Find a book"
              defaultValue={initialQuery ?? ""}
              onValueChange={setQuery}
            />
            <Button type="submit" className=":uno: px-1 line-height-none">
              <BiRefresh
                title="Refresh"
                size="20"
                className=":uno: align-top"
              />
            </Button>
          </ControlGroup>
        </form>
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
