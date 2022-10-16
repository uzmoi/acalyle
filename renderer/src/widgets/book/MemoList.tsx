import { css } from "@linaria/core";
import { clamp } from "emnorst";
import { useMemo, useState } from "react";
import { graphql, usePaginationFragment } from "react-relay";
import { useResize } from "~/shared/ui/hooks/use-resize";
import { columnSplit } from "~/shared/util/column-split";
import { MemoOverview, MemoOverviewStyle, contentsHeight } from "./MemoOverview";
import { MemoListFragment$key } from "./__generated__/MemoListFragment.graphql";

const columnWidth = 256;

export const MemoList: React.FC<{
    fragmentRef: MemoListFragment$key;
}> = ({ fragmentRef }) => {
    const {
        data,
    } = usePaginationFragment(graphql`
        fragment MemoListFragment on Book
        @refetchable(queryName: "MemoListPaginationQuery") {
            id
            memos(first: $count, after: $cursor)
            @connection(key: "MemoListFragment_memos") {
                __id
                edges {
                    node {
                        id
                        contents
                        ...MemoOverviewFragment
                    }
                }
            }
        }
    `, fragmentRef);

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

    return (
        <div ref={columnsEl} className={ColumnListStyle}>
            {columns.map((column, i) => (
                <div key={i} className={ColumnStyle}>
                    {column.map(node => (
                        <MemoOverview key={node.id} bookId={data.id} fragmentRef={node} />
                    ))}
                </div>
            ))}
        </div>
    );
};

const ColumnListStyle = css`
    display: flex;
`;

const ColumnStyle = css`
    flex: 1 0 0;
    min-width: 0;
    .${MemoOverviewStyle} {
        margin: 1em;
    }
`;
