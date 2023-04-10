import type { DocumentNode } from "graphql/language/ast";
import { atom } from "nanostores";

export type Network = {
    get: (path: string) => string;
    graphql: <T, U>(
        docNode: DocumentNode,
        variables: U,
        options?: { signal?: AbortSignal | undefined } | undefined,
    ) => Promise<{
        data: T;
    }>;
};

export const net = atom<Network | undefined>();
