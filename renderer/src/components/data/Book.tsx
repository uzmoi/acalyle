import { css } from "@linaria/core";
import { graphql, usePaginationFragment } from "react-relay";
import { Memo, MemoStyle } from "./Memo";
import { BookMemosFragment$key } from "./__generated__/BookMemosFragment.graphql";

const memosStyle = css`
    display: flex;
    flex-wrap: wrap;
    ${MemoStyle} {
        margin: 1em;
    }
`;

export const Book: React.FC<{
    book: {
        readonly title: string;
        readonly createdAt: string;
    } & BookMemosFragment$key;
}> = ({ book }) => {
    const {
        data,
    } = usePaginationFragment(graphql`
        fragment BookMemosFragment on Book
        @refetchable(queryName: "MemosPaginationQuery") {
            memos(first: $count, after: $cursor)
            @connection(key: "BookMemosFragment_memos") {
                edges {
                    node {
                        id
                        ...MemoFragment
                    }
                }
            }
        }
    `, book);

    return (
        <div>
            <h2>{book.title}</h2>
            <p>{book.createdAt}</p>
            <div className={memosStyle}>
                {data.memos.edges.map(({ node }) => (
                    <Memo key={node.id} fragmentRef={node} />
                ))}
            </div>
        </div>
    );
};
