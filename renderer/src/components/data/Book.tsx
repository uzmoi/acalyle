import { css } from "@linaria/core";
import { graphql, useMutation, usePaginationFragment } from "react-relay";
import { Memo, MemoStyle } from "./Memo";
import { BookMemoCreateMutation } from "./__generated__/BookMemoCreateMutation.graphql";
import { BookMemosFragment$key } from "./__generated__/BookMemosFragment.graphql";

const memosStyle = css`
    display: flex;
    flex-wrap: wrap;
    ${MemoStyle} {
        margin: 1em;
    }
`;

export const Book: React.FC<{
    id: string;
    book: {
        readonly title: string;
        readonly createdAt: string;
    } & BookMemosFragment$key;
}> = ({ id, book }) => {
    const {
        data,
    } = usePaginationFragment(graphql`
        fragment BookMemosFragment on Book
        @refetchable(queryName: "MemosPaginationQuery") {
            memos(first: $count, after: $cursor)
            @connection(key: "BookMemosFragment_memos") {
                __id
                edges {
                    node {
                        id
                        ...MemoFragment
                    }
                }
            }
        }
    `, book);
    const [commitAddMemo] = useMutation<BookMemoCreateMutation>(graphql`
        mutation BookMemoCreateMutation($bookId: ID!, $connections: [ID!]!) {
            createMemo(bookId: $bookId) {
                node @appendNode(connections: $connections, edgeTypeName: "Memo") {
                    ...MemoFragment
                }
            }
        }
    `);

    return (
        <div>
            <h2>{book.title}</h2>
            <p>{book.createdAt}</p>
            <button
                onClick={() => {
                    commitAddMemo({
                        variables: {
                            bookId: id,
                            connections: [data.memos.__id],
                        },
                    });
                }}
            >
                add memo
            </button>
            <div className={memosStyle}>
                {data.memos.edges.map(({ node }) => (
                    <Memo key={node.id} fragmentRef={node} />
                ))}
            </div>
        </div>
    );
};
