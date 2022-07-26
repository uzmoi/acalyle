import { css } from "@linaria/core";
import { graphql, usePaginationFragment } from "react-relay";
import { Link } from "~/router-react";
import { BookListFragment$key } from "./__generated__/BookListFragment.graphql";
import { BookListPaginationQuery } from "./__generated__/BookListPaginationQuery.graphql";

export const BookList: React.FC<{
    queryRef: BookListFragment$key;
}> = ({ queryRef }) => {
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
                        <Link pattern="books/:id" params={{ id: node.id }}>
                            <p>{node.title}</p>
                        </Link>
                    </li>
                ))}
            </ul>
            <button onClick={() => loadNext(16)} disabled={!hasNext || isLoadingNext}>
                load more books
            </button>
        </div>
    );
};

const BookListStyle = css`
    padding: 0;
    margin: 0;
    list-style: none;
    > li {
        margin: 1em;
        a {
            display: inline-block;
            width: 100%;
            height: 6em;
            padding: 1em;
            cursor: pointer;
            background-color: #101018;
            p {
                margin: 0;
                font-size: 2em;
            }
        }
    }
`;
