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
            <ul>
                {data.books.edges.map(({ node }) => (
                    <li key={node.id}>
                        <Link pattern="books/:id" params={{ id: node.id }}>
                            {node.title}
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
