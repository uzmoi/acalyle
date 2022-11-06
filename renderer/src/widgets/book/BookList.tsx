import { css } from "@linaria/core";
import { graphql, usePaginationFragment } from "react-relay";
import { BookOverview } from "~/entities/book";
import { Button } from "~/shared/control";
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

    return (
        <div>
            <ul className={BookListStyle}>
                {data.books.edges.map(({ node }) => (
                    <li key={node.id}>
                        <Link
                            pattern="books/:bookId"
                            params={{ bookId: node.id }}
                        >
                            <BookOverview
                                thumbnail={node.thumbnail}
                                title={node.title}
                            />
                        </Link>
                    </li>
                ))}
            </ul>
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
