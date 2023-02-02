import { css } from "@linaria/core";
import { nonNullable } from "emnorst";
import { useMemo } from "react";
import { graphql, usePaginationFragment } from "react-relay";
import { BookOverview } from "~/entities/book";
import { List } from "~/shared/base";
import { Button } from "~/shared/control";
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

    const books = useMemo(
        () =>
            data.books.edges
                ?.filter(nonNullable)
                .map(edge => edge.node)
                .filter(nonNullable) ?? [],
        [data.books.edges],
    );

    return (
        <div>
            <List className={BookListStyle}>
                {books.map(book => (
                    <List.Item key={book.id}>
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

const BookListStyle = css`
    > li {
        margin: 1em;
        a {
            display: inline-block;
            width: 100%;
            cursor: pointer;
        }
    }
`;
