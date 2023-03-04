import { Tab } from "@headlessui/react";
import { css, cx } from "@linaria/core";
import { useCallback, useEffect, useMemo } from "react";
import { graphql, usePaginationFragment } from "react-relay";
import { rootEl } from "~/app/root-el";
import { MemoColumns } from "~/entities/memo/ui/memo-columns";
import { MemoList as MemoList_ } from "~/entities/memo/ui/memo-list";
import { getNodes } from "~/shared/base/connection";
import { Intersection } from "~/shared/base/intersection";
import {
    ControlPartOutlineStyle,
    ControlPartResetStyle,
} from "~/shared/control/base";
import { ControlGroupStyle } from "~/shared/control/group";
import type { MemoListFragment$key } from "./__generated__/MemoListFragment.graphql";
import type { MemoListPaginationQuery } from "./__generated__/MemoListPaginationQuery.graphql";

export const MemoList: React.FC<{
    fragmentRef: MemoListFragment$key;
    search?: string;
}> = ({ fragmentRef, search }) => {
    // prettier-ignore
    const {
        data,
        hasNext,
        isLoadingNext,
        loadNext,
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

    const shouldLoadNext = hasNext && !isLoadingNext;
    const onIntersection = useCallback(
        (entry: IntersectionObserverEntry) => {
            if (entry.isIntersecting && shouldLoadNext) {
                loadNext(32);
            }
        },
        [shouldLoadNext, loadNext],
    );

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
            <Intersection
                onIntersection={onIntersection}
                root={rootEl.current}
                rootMargin="25% 0px"
                className={css`
                    height: 1px;
                `}
            />
        </div>
    );
};

const ControlPartStyle = cx(ControlPartResetStyle, ControlPartOutlineStyle);
