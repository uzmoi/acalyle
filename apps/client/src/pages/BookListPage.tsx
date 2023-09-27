import { Alert, Intersection, Spinner, vars } from "@acalyle/ui";
import { style } from "@macaron-css/core";
import { useStore } from "@nanostores/react";
import { useCallback, useDeferredValue, useState } from "react";
import { BiBookAdd, BiError } from "react-icons/bi";
import { bookConnection } from "~/store/book-connection";
import { BookSearchBar } from "~/ui/BookSearchBar";
import { Link } from "~/ui/Link";
import { BookOverviewWarpList } from "~/ui/book/BookOverviewWarpList";
import type { NetworkError } from "../app/network";
import { link } from "./link";

export const BookListPage: React.FC = () => {
    const [query, setQuery] = useState("");
    const deferredQuery = useDeferredValue(query);
    const isLoading = useStore(bookConnection(deferredQuery).isLoading);
    const error = useStore(bookConnection(deferredQuery).error) as
        | NetworkError
        | undefined;

    const onIntersection = useCallback(
        (entry: IntersectionObserverEntry) => {
            if (entry.isIntersecting) {
                void bookConnection(deferredQuery).loadNext();
            }
        },
        [deferredQuery],
    );

    const refetchBookConnection = useCallback(() => {
        void bookConnection(deferredQuery).refetch();
    }, [deferredQuery]);

    return (
        <main className={style({ padding: "1.25em" })}>
            <div
                className={style({
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "1.5em",
                })}
            >
                <div className={style({ flex: "1 1" })}>
                    <BookSearchBar
                        query={query}
                        onQueryChange={setQuery}
                        onRefresh={refetchBookConnection}
                    />
                </div>
                <Link to={link("new")} className={style({ marginLeft: "1em" })}>
                    <BiBookAdd className={style({ verticalAlign: "middle" })} />
                    <span className={style({ marginLeft: "0.25em" })}>New</span>
                </Link>
            </div>
            <BookOverviewWarpList query={deferredQuery} />
            <Intersection
                onIntersection={onIntersection}
                rootMargin="25% 0px"
            />
            {isLoading && (
                <div
                    className={style({
                        display: "inline-block",
                        marginTop: "1em",
                        marginLeft: "50%",
                        transform: "translateX(-50%)",
                    })}
                >
                    <span
                        className={style({
                            height: "1em",
                            marginRight: "4em",
                            verticalAlign: "top",
                        })}
                    >
                        Loading...
                    </span>
                    <Spinner
                        className={style({ vars: { "--size": "1.5em" } })}
                    />
                </div>
            )}
            {error && (
                <Alert type="error">
                    <BiError
                        className={style({
                            color: vars.color.denger,
                            fontSize: "1.75em",
                            marginRight: "0.25em",
                        })}
                    />
                    <span className={style({ verticalAlign: "middle" })}>
                        Failed to load books.
                    </span>
                    <p>error code: {error.type}</p>
                    {error.type === "http_error" && (
                        <p>status: {error.status}</p>
                    )}
                </Alert>
            )}
        </main>
    );
};
