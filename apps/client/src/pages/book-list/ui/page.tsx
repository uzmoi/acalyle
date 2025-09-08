import { cx, style } from "@acalyle/css";
import {
  Button,
  ControlGroup,
  Intersection,
  List,
  TextInput,
} from "@acalyle/ui";
import { Link, useRouter } from "@tanstack/react-router";
import { startTransition, useCallback } from "react";
import { BiBookAdd, BiRefresh } from "react-icons/bi";
import type { BooksPage } from "../api";
import { BookOverview } from "./overview";

export const BookListPage: React.FC<{
  initialQuery?: string | undefined;
  booksPage: BooksPage;
}> = ({ initialQuery, booksPage }) => {
  const router = useRouter();
  const setQuery = (query: string): void => {
    startTransition(async () => {
      await router.navigate({ to: "/books", search: { query } });
    });
  };

  const onIntersection = useCallback((entry: IntersectionObserverEntry) => {
    if (entry.isIntersecting) {
      // void connection.loadNextPage();
    }
  }, []);

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
      <List
        className={cx(
          ":uno: grid gap-x-5 gap-y-3",
          style({ gridTemplateColumns: "repeat(auto-fit, minmax(32em, 1fr))" }),
        )}
      >
        {booksPage.books.map(book => (
          <List.Item key={book.id}>
            <BookOverview book={book} />
          </List.Item>
        ))}
      </List>
      <Intersection onIntersection={onIntersection} rootMargin="25% 0px" />
      {/* {isLoading && (
        <div className=":uno: ml-50% mt-4 inline-block translate-x--50%">
          <span className=":uno: mr-16 h-4 align-top">Loading...</span>
          <Spinner className={style({ "--size": "1.5em" })} />
        </div>
      )} */}
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
