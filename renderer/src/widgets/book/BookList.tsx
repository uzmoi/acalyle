import { css, cx } from "@linaria/core";
import { startTransition, useCallback, useMemo } from "react";
import { graphql, usePaginationFragment } from "react-relay";
import type { RefetchFnDynamic } from "react-relay/relay-hooks/useRefetchableFragmentNode";
import { rootEl } from "~/app/root-el";
import { BookOverview } from "~/entities/book";
import { Link } from "~/features/location";
import { BookSearchBar } from "~/features/search-book";
import { link } from "~/pages/link";
import { List, Spinner } from "~/shared/base";
import { getNodes } from "~/shared/base/connection";
import { Intersection } from "~/shared/base/intersection";
import { ControlPartOutlineStyle } from "~/shared/control/base";
import type { BookListFragment$key } from "./__generated__/BookListFragment.graphql";
import type { BookListPaginationQuery } from "./__generated__/BookListPaginationQuery.graphql";

export const BookList: React.FC<{
    queryRef: BookListFragment$key;
}> = ({ queryRef }) => {
    // prettier-ignore
    const {
        data,
        hasNext,
        isLoadingNext,
        loadNext,
        refetch,
    } = usePaginationFragment<BookListPaginationQuery, BookListFragment$key>(graphql`
        fragment BookListFragment on Query
        @refetchable(queryName: "BookListPaginationQuery") {
            books(
                first: $count
                after: $cursor
                query: $query
                orderBy: $orderBy
                order: $order
            ) @connection(key: "BookListFragment_books") {
                edges {
                    node {
                        id
                        ...overview
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

    type RefetchTransition = (
        ...args: Parameters<
            RefetchFnDynamic<BookListPaginationQuery, BookListFragment$key>
        >
    ) => void;
    const refetchTransition = useCallback<RefetchTransition>(
        (vars, options) => {
            startTransition(() => {
                refetch(vars, options);
            });
        },
        [refetch],
    );

    return (
        <div>
            <div
                className={css`
                    display: flex;
                    padding-bottom: 0.5em;
                `}
            >
                <BookSearchBar
                    refetch={refetchTransition}
                    className={css`
                        flex: 1 0;
                    `}
                />
                <Link
                    to={link("books/new")}
                    className={cx(
                        ControlPartOutlineStyle,
                        css`
                            margin-left: 1em;
                        `,
                    )}
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
                        <BookOverview book={book} />
                    </List.Item>
                ))}
            </List>
            <Intersection
                onIntersection={onIntersection}
                root={rootEl.current}
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
