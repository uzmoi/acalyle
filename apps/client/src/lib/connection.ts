import { identify, nonNullable } from "emnorst";
import {
    type ReadableAtom,
    type WritableAtom,
    atom,
    onStart,
} from "nanostores";
import type { GqlPageInfo, Maybe } from "~/__generated__/graphql";
import { derived, pure } from "~/lib/derived";
import type { PromiseLoaderExt, PromiseLoaderW } from "~/lib/promise-loader";

export type GqlConnection<TNode extends { id: string }> = {
    __typename?: `${string}Connection`;
    edges?: Maybe<readonly Maybe<{ node?: Maybe<TNode> }>[]>;
    pageInfo: Pick<GqlPageInfo, "hasNextPage" | "endCursor">;
};

export type IdConnection = {
    nodeIds: readonly string[];
    hasNext: boolean;
    endCursor: string | null;
};

export type Connection<TNode extends { id: string }> = {
    nodes: readonly TNode[];
    hasNext: boolean;
    endCursor: string | null;
    isLoading: boolean;
};

export type ConnectionExt = {
    loadNext: () => Promise<void>;
    refetch: () => Promise<void>;
};

export const createConnectionAtom = <TNode extends { id: string }>(
    nodeStore: (
        id: string,
    ) => ReadableAtom<PromiseLoaderW<TNode | null>> & PromiseLoaderExt,
    load: (atom: WritableAtom<IdConnection>) => Promise<GqlConnection<TNode>>,
): ReadableAtom<Connection<TNode>> & ConnectionExt => {
    const idConnectionStore = atom<IdConnection>({
        nodeIds: [],
        hasNext: true,
        endCursor: null,
    });
    const isLoading = atom(false);

    const nodesStore = derived(get => {
        const nodeLoaders = get(idConnectionStore).nodeIds.map(id =>
            get(nodeStore(id)),
        );
        if (
            !nodeLoaders.every(
                (
                    loader,
                ): loader is { status: "fulfilled"; value: TNode | null } =>
                    loader.status === "fulfilled",
            )
        ) {
            return pure<TNode[]>([]);
        }
        return pure<TNode[]>(
            nodeLoaders.map(loader => loader.value).filter(nonNullable),
        );
    });

    const connectionStore = derived(get =>
        pure({
            ...get(idConnectionStore),
            nodes: get(nodesStore),
            isLoading: get(isLoading),
        }),
    ) satisfies ConnectionExt;

    const loadNodes = async (
        getIds: (ids: readonly string[]) => readonly string[],
    ) => {
        isLoading.set(true);
        const { edges, pageInfo } = await load(idConnectionStore);
        const nodes = edges?.map(edge => edge?.node).filter(nonNullable) ?? [];
        for (const node of nodes) {
            nodeStore(node.id).resolve(node);
        }
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
