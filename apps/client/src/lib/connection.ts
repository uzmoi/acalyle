import { nonNullable } from "emnorst";
import { type WritableAtom, atom, onStart } from "nanostores";
import type { GqlPageInfo, Maybe } from "~/__generated__/graphql";

export type GqlConnection<TNode extends { id: string }> = {
    __typename?: `${string}Connection`;
    edges?: Maybe<readonly Maybe<{ node?: Maybe<TNode> }>[]>;
    pageInfo: Pick<GqlPageInfo, "hasNextPage" | "endCursor">;
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
    load: (
        atom: WritableAtom<Connection<TNode>>,
    ) => Promise<GqlConnection<TNode>>,
): WritableAtom<Connection<TNode>> & ConnectionExt => {
    const connectionAtom = atom<Connection<TNode>, ConnectionExt>({
        nodes: [],
        hasNext: true,
        endCursor: null,
        isLoading: false,
    });

    connectionAtom.loadNext = async () => {
        const { hasNext, isLoading } = connectionAtom.get();
        if (!hasNext || isLoading) return;
        connectionAtom.set({
            ...connectionAtom.get(),
            isLoading: true,
        });
        const { edges, pageInfo } = await load(connectionAtom);
        const nodes = edges?.map(edge => edge?.node).filter(nonNullable) ?? [];
        connectionAtom.set({
            nodes: [...connectionAtom.get().nodes, ...nodes],
            hasNext: pageInfo.hasNextPage,
            endCursor: (pageInfo.hasNextPage && pageInfo.endCursor) || null,
            isLoading: false,
        });
    };

    connectionAtom.refetch = async () => {
        connectionAtom.set({
            nodes: [],
            hasNext: true,
            endCursor: null,
            isLoading: true,
        });
        const { edges, pageInfo } = await load(connectionAtom);
        const nodes = edges?.map(edge => edge?.node).filter(nonNullable) ?? [];
        connectionAtom.set({
            nodes,
            hasNext: pageInfo.hasNextPage,
            endCursor: (pageInfo.hasNextPage && pageInfo.endCursor) || null,
            isLoading: false,
        });
    };

    onStart(connectionAtom, () => {
        void connectionAtom.loadNext();
    });

    return connectionAtom;
};
