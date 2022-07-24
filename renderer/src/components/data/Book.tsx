import { css } from "@linaria/core";
import { useEffect, useMemo, useRef, useState } from "react";
import { graphql, useMutation, usePaginationFragment } from "react-relay";
import { columnSplit } from "~/column-split";
import { Memo, MemoStyle, contentsHeight } from "./Memo";
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

    const columnsEl = useRef<HTMLDivElement>(null);
    const [columnsCount, setColumnsCount] = useState(16);
    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const el = columnsEl.current!;
        const observer = new ResizeObserver(es => {
            console.log(es);
            setColumnsCount(Math.floor(es[0].contentRect.width / 256));
        });
        observer.observe(el);
        return () => {
            observer.unobserve(el);
        };
    }, []);

    const columns = useMemo(() => {
        return columnSplit(
            data.memos.edges.map(x => x.node),
            columnsCount,
            node => contentsHeight(node.contents),
        );
    }, [data.memos.edges, columnsCount]);

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
            <div ref={columnsEl} className={memosStyle}>
                {columns.map((column, i) => (
                    <div key={i}>
                        {column.map(node => (
                            <Memo key={node.id} fragmentRef={node} />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};
