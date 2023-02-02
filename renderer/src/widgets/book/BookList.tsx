import { css } from "@linaria/core";
import { useMemo } from "react";
import { graphql, usePaginationFragment } from "react-relay";
import { BookOverview } from "~/entities/book";
import { link } from "~/pages/link";
import { List } from "~/shared/base";
import { getNodes } from "~/shared/base/connection";
import { Button } from "~/shared/control";
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
            <Button
                onClick={() => loadNext(16)}
                disabled={!hasNext || isLoadingNext}
            >
                load more books
            </Button>
        </div>
    );
};
