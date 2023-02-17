import { Tab } from "@headlessui/react";
import { cx } from "@linaria/core";
import { useEffect, useMemo } from "react";
import { graphql, usePaginationFragment } from "react-relay";
import { MemoColumns } from "~/entities/memo/ui/memo-columns";
import { MemoList as MemoList_ } from "~/entities/memo/ui/memo-list";
import { getNodes } from "~/shared/base/connection";
import {
    ControlPartOutlineStyle,
    ControlPartResetStyle,
} from "~/shared/control/base";
import { ControlGroupStyle } from "~/shared/control/group";
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

    const memos = useMemo(() => getNodes(data.memos.edges), [data.memos.edges]);

    return (
        <div>
            <Tab.Group>
                <Tab.List className={ControlGroupStyle}>
                    <Tab className={ControlPartStyle}>columns</Tab>
                    <Tab className={ControlPartStyle}>list</Tab>
                </Tab.List>
                <Tab.Panels>
                    <Tab.Panel>
                        <MemoColumns bookId={data.id} memos={memos} />
                    </Tab.Panel>
                    <Tab.Panel>
                        <MemoList_ bookId={data.id} memos={memos} />
                    </Tab.Panel>
                </Tab.Panels>
            </Tab.Group>
        </div>
    );
};

const ControlPartStyle = cx(ControlPartResetStyle, ControlPartOutlineStyle);
