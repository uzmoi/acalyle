import { cx, style } from "@acalyle/css";
import {
  Button,
  ControlGroup,
  Intersection,
  List,
  TextInput,
} from "@acalyle/ui";
import { Link } from "@tanstack/react-router";
import { useCallback, useDeferredValue, useState } from "react";
import { BiBookAdd, BiRefresh } from "react-icons/bi";
import { $bookConnection, type BookId, BookOverview } from "~/entities/book";
import { useConnection } from "~/shared/graphql";

export const BookListPage: React.FC = () => {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  const { nodeIds } = useConnection($bookConnection(deferredQuery ?? ""));

  const onIntersection = useCallback(
    (entry: IntersectionObserverEntry) => {
      if (entry.isIntersecting) {
        void $bookConnection(deferredQuery).loadNextPage();
      }
    },
    [deferredQuery],
  );

  const refetchBookConnection = useCallback(() => {
    // void $bookConnection(deferredQuery).refetch();
  }, []);

  return (
    <main className=":uno: p-5">
      <div className=":uno: mb-6 flex items-center gap-4">
        <form action={refetchBookConnection} className=":uno: flex-1">
          <ControlGroup className=":uno: flex">
            <TextInput
              type="search"
              className=":uno: flex-1"
              placeholder="Find a book"
              value={query}
              onValueChange={setQuery}
            />
            <Button
              type="submit"
              aria-label="Refresh"
              className=":uno: px-3 text-xl"
            >
              <BiRefresh />
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
          ":uno: grid gap-x-5 gap-y-4",
          style({ gridTemplateColumns: "repeat(auto-fit, minmax(32em, 1fr))" }),
        )}
      >
        {nodeIds.map(bookId => (
          <List.Item key={bookId}>
            <BookOverview bookId={bookId as string as BookId} />
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
