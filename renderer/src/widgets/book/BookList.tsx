import { css } from "@linaria/core";
import { useCallback, useMemo } from "react";
import { graphql, usePaginationFragment } from "react-relay";
import { BookOverview } from "~/entities/book";
import { link } from "~/pages/link";
import { List, Spinner } from "~/shared/base";
import { getNodes } from "~/shared/base/connection";
import { Intersection } from "~/shared/base/intersection";
import { ControlPartOutlineStyle } from "~/shared/control/base";
import { Link } from "~/shared/router/react";
import { BookListFragment$key } from "./__generated__/BookListFragment.graphql";
import { BookListPaginationQuery } from "./__generated__/BookListPaginationQuery.graphql";

export const BookList: React.FC<{
    queryRef: BookListFragment$key;
}> = ({ queryRef }) => {
    // prettier-ignore
    const {
        data,
        hasNext,
        isLoadingNext,
        loadNext,
    } = usePaginationFragment<BookListPaginationQuery, BookListFragment$key>(graphql`
        fragment BookListFragment on Query
        @refetchable(queryName: "BookListPaginationQuery") {
            books(first: $count, after: $cursor)
            @connection(key: "BookListFragment_books") {
                edges {
                    node {
                        id
                        title
                        thumbnail
                    }
                }
            }
        }
    `, queryRef);

    const shouldLoadNext = hasNext && !isLoadingNext;
    const onIntersection = useCallback(
        (entry: IntersectionObserverEntry) => {
            if (entry.isIntersecting && shouldLoadNext) {
                loadNext(16);
            }
        },
        [shouldLoadNext, loadNext],
    );

    const books = useMemo(() => getNodes(data.books.edges), [data.books.edges]);

    return (
        <div>
            <div
                className={css`
                    padding-bottom: 0.5em;
                `}
            >
                <Link
                    to={link("books/new")}
                    className={ControlPartOutlineStyle}
                >
                    New
                </Link>
            </div>
            <List>
                {books.map(book => (
                    <List.Item
                        key={book.id}
                        className={css`
                            margin-top: 1em;
                        `}
                    >
                        <BookOverview
                            thumbnail={book.thumbnail}
                            title={book.title}
                            bookId={book.id}
                        />
                    </List.Item>
                ))}
            </List>
            <Intersection
                onIntersection={onIntersection}
                rootMargin="25% 0px"
            />
            {isLoadingNext && (
                <div
                    className={css`
                        display: inline-block;
                        margin-top: 1em;
                        margin-left: 50%;
                        transform: translateX(-50%);
                    `}
                >
                    <span
                        className={css`
                            height: 1em;
                            margin-right: 4em;
                            vertical-align: top;
                        `}
                    >
                        Loading...
                    </span>
                    <Spinner size={1.5} />
                </div>
            )}
        </div>
    );
};
