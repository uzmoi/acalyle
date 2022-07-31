import { css } from "@linaria/core";
import { clamp } from "emnorst";
import { useMemo, useState } from "react";
import { graphql, useMutation, usePaginationFragment } from "react-relay";
import { columnSplit } from "~/column-split";
import { useResize } from "~/lib/use-resize";
import { Memo, MemoStyle, contentsHeight } from "./Memo";
import { BookMemoCreateMutation } from "./__generated__/BookMemoCreateMutation.graphql";
import { BookMemosFragment$key } from "./__generated__/BookMemosFragment.graphql";

const columnWidth = 256;

export const Book: React.FC<{
    id: string;
    book: BookMemosFragment$key;
}> = ({ id, book }) => {
    const {
        data,
    } = usePaginationFragment(graphql`
        fragment BookMemosFragment on Book
        @refetchable(queryName: "MemosPaginationQuery") {
            title
            memos(first: $count, after: $cursor)
            @connection(key: "BookMemosFragment_memos") {
                __id
                edges {
                    node {
                        id
                        contents
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

    const [columnsCount, setColumnsCount] = useState(16);
    const columnsEl = useResize<HTMLDivElement>(entry => {
        setColumnsCount(clamp(Math.floor(entry.contentRect.width / columnWidth), 1, 6));
    });

    const columns = useMemo(() => {
        return columnSplit(
            data.memos.edges.map(x => x.node),
            columnsCount,
            node => contentsHeight(node.contents),
        );
    }, [data.memos.edges, columnsCount]);

    const addMemo = () => {
        commitAddMemo({
            variables: {
                bookId: id,
                connections: [data.memos.__id],
            },
        });
    };

    return (
        <div>
            <div className={BookHeaderStyle}>
                <h2 className={BookTitleStyle}>{data.title}</h2>
                <ul className={ButtonListStyle}>
                    <li>
                        <button onClick={addMemo}>add memo</button>
                    </li>
                </ul>
            </div>
            <div ref={columnsEl} className={ColumnListStyle}>
                {columns.map((column, i) => (
                    <div key={i} className={ColumnStyle}>
                        {column.map(node => (
                            <Memo key={node.id} fragmentRef={node} />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

const BookHeaderStyle = css`
    display: flex;
    padding: 1em;
    padding-right: 2em;
    padding-left: 2em;
`;

const BookTitleStyle = css`
    flex-grow: 1;
`;

const ButtonListStyle = css`
    display: flex;
    flex-shrink: 0;
    > li ~ li {
        margin-left: 0.8em;
    }
`;

const ColumnListStyle = css`
    display: flex;
`;

const ColumnStyle = css`
    flex-grow: 1;
    flex-shrink: 0;
    .${MemoStyle} {
        margin: 1em;
    }
`;
