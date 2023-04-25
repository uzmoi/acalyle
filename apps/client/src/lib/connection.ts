import { identify, nonNullable } from "emnorst";
import {
    type ReadableAtom,
    type WritableAtom,
    atom,
    onStart,
} from "nanostores";
import type { GqlPageInfo, Maybe } from "~/__generated__/graphql";

export type GqlConnection<TNode extends { id: string }> = {
    __typename?: `${string}Connection`;
    edges?: Maybe<readonly Maybe<{ node?: Maybe<TNode> }>[]>;
    pageInfo: Pick<GqlPageInfo, "hasNextPage" | "endCursor">;
};

export type Connection = {
    nodeIds: readonly string[];
    hasNext: boolean;
    endCursor: string | null;
};

export type ConnectionExt = {
    loadNext: () => Promise<void>;
    refetch: () => Promise<void>;
    isLoading: ReadableAtom<boolean>;
};

export const createConnectionAtom = <TNode extends { id: string }>(
    load: (atom: WritableAtom<Connection>) => Promise<GqlConnection<TNode>>,
    updateNode: (node: TNode) => void,
): ReadableAtom<Connection> & ConnectionExt => {
    const connectionStore = atom<Connection, ConnectionExt>({
        nodeIds: [],
        hasNext: true,
        endCursor: null,
    });
    const isLoading = atom(false);

    connectionStore.isLoading = isLoading;

    const loadNodes = async (
        getIds: (ids: readonly string[]) => readonly string[],
    ) => {
        isLoading.set(true);
        const { edges, pageInfo } = await load(connectionStore);
        const nodes = edges?.map(edge => edge?.node).filter(nonNullable) ?? [];
        nodes.forEach(updateNode);
        connectionStore.set({
            nodeIds: getIds(nodes.map(node => node.id)),
            hasNext: pageInfo.hasNextPage,
            endCursor: (pageInfo.hasNextPage && pageInfo.endCursor) || null,
        });
        isLoading.set(false);
    };

    connectionStore.loadNext = async () => {
        const { hasNext } = connectionStore.get();
        if (!hasNext || isLoading.get()) return;
        await loadNodes(nodeIds => [
            ...connectionStore.get().nodeIds,
            ...nodeIds,
        ]);
    };

    connectionStore.refetch = async () => {
        connectionStore.set({
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
