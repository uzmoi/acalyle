import { identify, nonNullable } from "emnorst";
import {
    type ReadableAtom,
    type WritableAtom,
    atom,
    onStart,
} from "nanostores";
import type { GqlPageInfo, Maybe, Scalars } from "~/__generated__/graphql";

export type GqlConnection<TNode extends { id: string }> = {
    __typename?: `${string}Connection`;
    edges?: Maybe<readonly Maybe<{ node?: Maybe<TNode> }>[]>;
    pageInfo: Pick<GqlPageInfo, "hasNextPage" | "endCursor">;
};

export type Connection = {
    nodeIds: readonly Scalars["ID"][];
    hasNext: boolean;
    endCursor: string | null;
};

export type ConnectionExt = {
    loadNext: () => Promise<void>;
    refetch: () => Promise<void>;
    isLoading: ReadableAtom<boolean>;
    error: ReadableAtom<Error | undefined>;
};

export const createConnectionAtom = <TNode extends { id: Scalars["ID"] }>(
    load: (atom: WritableAtom<Connection>) => Promise<GqlConnection<TNode>>,
    updateNode: (node: TNode) => void,
): ReadableAtom<Connection> & ConnectionExt => {
    const connectionStore = atom<Connection, ConnectionExt>({
        nodeIds: [],
        hasNext: true,
        endCursor: null,
    });
    const isLoading = atom(false);
    const $error = atom<Error | undefined>();

    connectionStore.isLoading = isLoading;
    connectionStore.error = $error;

    const loadNodes = async (
        getIds: (ids: readonly Scalars["ID"][]) => readonly Scalars["ID"][],
    ) => {
        isLoading.set(true);
        $error.set(undefined);
        try {
            const { edges, pageInfo } = await load(connectionStore);
            const nodes =
                edges?.map(edge => edge?.node).filter(nonNullable) ?? [];
            for (const node of nodes) {
                updateNode(node);
            }
            connectionStore.set({
                nodeIds: getIds(nodes.map(node => node.id)),
                hasNext: pageInfo.hasNextPage,
                // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
                endCursor: (pageInfo.hasNextPage && pageInfo.endCursor) || null,
            });
        } catch (error) {
            $error.set(error as Error);
        } finally {
            isLoading.set(false);
        }
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
