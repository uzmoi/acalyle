import { useEffect } from "react";
import { graphql, usePaginationFragment } from "react-relay";
import { MemoColumns } from "~/entities/memo/ui/memo-columns";
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

    return (
        <MemoColumns
            bookId={data.id}
            memos={data.memos.edges.map(edge => edge.node)}
        />
    );
};
