import { Environment, Network, Store, RecordSource, GraphQLResponse } from "relay-runtime";
import {  } from "react-relay";
import type { IPC } from "main/src/ipc";

declare const ipc: IPC;

declare module globalThis {
    let ipc: IPC;
}

if(import.meta.vitest) {
    const { vi } = import.meta.vitest;
    globalThis.ipc = {
        cwd: vi.fn().mockResolvedValue("cwd"),
        graphql: vi.fn(),
    };
}

export const relayEnv = new Environment({
    network: Network.create(async (params, variables): Promise<GraphQLResponse> => {
        if(params.text) {
            const result = await ipc.graphql(params.text, variables);
            return {
                data: result.data || undefined!,
                errors: result.errors?.map(err => ({
                    message: err.message,
                    locations: err.locations?.slice(),
                })),
                extensions: result.extensions,
            };
        }
        return Promise.reject();
    }),
    store: new Store(new RecordSource()),
});

export const acalyle = {
    cwd: ipc.cwd,
};
