import { css } from "@linaria/core";
import { clamp } from "emnorst";
import { useEffect, useMemo, useState } from "react";
import { graphql, usePaginationFragment } from "react-relay";
import { columnSplit } from "~/shared/columns";
import { useResize } from "~/shared/ui/hooks/use-resize";
import { MemoOverview, MemoOverviewStyle, contentsHeight } from "./MemoOverview";
import { MemoListFragment$key } from "./__generated__/MemoListFragment.graphql";
import { MemoListPaginationQuery } from "./__generated__/MemoListPaginationQuery.graphql";

const columnWidth = 256;

export const MemoList: React.FC<{
    fragmentRef: MemoListFragment$key;
    search?: string;
}> = ({ fragmentRef, search }) => {
    const {
        data,
        refetch,
    } = usePaginationFragment<MemoListPaginationQuery, MemoListFragment$key>(graphql`
        fragment MemoListFragment on Book
        @argumentDefinitions(search: { type: "String" })
        @refetchable(queryName: "MemoListPaginationQuery") {
            id
            memos(first: $count, after: $cursor, search: $search)
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

    useEffect(() => {
        refetch({ search });
    }, [refetch, search]);

    const [columnsCount, setColumnsCount] = useState(16);
    const columnsEl = useResize<HTMLDivElement>(entry => {
        setColumnsCount(clamp(Math.floor(entry.contentRect.width / columnWidth), 1, 6));
    });

    const columns = useMemo(() => {
        return columnSplit(
            data.memos.edges.map(({ node }) => ({
                node,
                height: contentsHeight(node.contents),
            })),
            columnsCount,
        );
    }, [data.memos.edges, columnsCount]);

    return (
        <div ref={columnsEl} className={ColumnListStyle}>
            {columns.map((column, i) => (
                <div key={i} className={ColumnStyle}>
                    {column.map(({ node }) => (
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
