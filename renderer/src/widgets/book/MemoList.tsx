import { useEffect, useMemo, useState } from "react";
import { graphql, usePaginationFragment } from "react-relay";
import { MemoColumns } from "~/entities/memo/ui/memo-columns";
import { MemoList as MemoList_ } from "~/entities/memo/ui/memo-list";
import { getNodes } from "~/shared/base/connection";
import { Select } from "~/shared/control";
import { MemoListFragment$key } from "./__generated__/MemoListFragment.graphql";
import { MemoListPaginationQuery } from "./__generated__/MemoListPaginationQuery.graphql";

export const MemoList: React.FC<{
    fragmentRef: MemoListFragment$key;
    search?: string;
}> = ({ fragmentRef, search }) => {
    // prettier-ignore
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
                        tags
                    }
                }
            }
        }
    `, fragmentRef);

    useEffect(() => {
        refetch({ search }).dispose();
    }, [refetch, search]);

    const [layoutStyle, setLayoutStyle] = useState<"columns" | "list">(
        "columns",
    );

    const memos = useMemo(() => getNodes(data.memos.edges), [data.memos.edges]);

    return (
        <div>
            {/* @ts-expect-error FIXME onValueChangeがunionじゃない */}
            <Select value={layoutStyle} onValueChange={setLayoutStyle}>
                <Select.Option>columns</Select.Option>
                <Select.Option>list</Select.Option>
            </Select>
            {
                {
                    columns: <MemoColumns bookId={data.id} memos={memos} />,
                    list: <MemoList_ bookId={data.id} memos={memos} />,
                }[layoutStyle]
            }
        </div>
    );
};
