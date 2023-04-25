import { identify, nonNullable } from "emnorst";
import {
    type ReadableAtom,
    type WritableAtom,
    atom,
    onStart,
} from "nanostores";
import type { GqlPageInfo, Maybe } from "~/__generated__/graphql";
import { derived, pure } from "~/lib/derived";

export type GqlConnection<TNode extends { id: string }> = {
    __typename?: `${string}Connection`;
    edges?: Maybe<readonly Maybe<{ node?: Maybe<TNode> }>[]>;
    pageInfo: Pick<GqlPageInfo, "hasNextPage" | "endCursor">;
};

export type Connection = {
    nodeIds: readonly string[];
    hasNext: boolean;
    endCursor: string | null;
    isLoading: boolean;
};

export type ConnectionExt = {
    loadNext: () => Promise<void>;
    refetch: () => Promise<void>;
};

export const createConnectionAtom = <TNode extends { id: string }>(
    load: (
        atom: WritableAtom<Omit<Connection, "isLoading">>,
    ) => Promise<GqlConnection<TNode>>,
    updateNode: (node: TNode) => void,
): ReadableAtom<Connection> & ConnectionExt => {
    const idConnectionStore = atom<Omit<Connection, "isLoading">>({
        nodeIds: [],
        hasNext: true,
        endCursor: null,
    });
    const isLoading = atom(false);

    const connectionStore = derived(get =>
        pure({
            ...get(idConnectionStore),
            isLoading: get(isLoading),
        }),
    ) satisfies ConnectionExt;

    const loadNodes = async (
        getIds: (ids: readonly string[]) => readonly string[],
    ) => {
        isLoading.set(true);
        const { edges, pageInfo } = await load(idConnectionStore);
        const nodes = edges?.map(edge => edge?.node).filter(nonNullable) ?? [];
        nodes.forEach(updateNode);
        idConnectionStore.set({
            nodeIds: getIds(nodes.map(node => node.id)),
            hasNext: pageInfo.hasNextPage,
            endCursor: (pageInfo.hasNextPage && pageInfo.endCursor) || null,
        });
        isLoading.set(false);
    };

    connectionStore.loadNext = async () => {
        const { hasNext } = idConnectionStore.get();
        if (!hasNext || isLoading.get()) return;
        await loadNodes(nodeIds => [
            ...idConnectionStore.get().nodeIds,
            ...nodeIds,
        ]);
    };

    connectionStore.refetch = async () => {
        idConnectionStore.set({
            nodeIds: [],
            hasNext: true,
            endCursor: null,
        });
        await loadNodes(identify);
    };

    onStart(connectionStore, () => {
        void connectionStore.loadNext();
    });

    return connectionStore;
};
