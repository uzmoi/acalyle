import type { IPC } from "main/src/ipc";
// eslint-disable-next-line import/no-extraneous-dependencies
import { Environment, GraphQLResponse, Network, RecordSource, Store } from "relay-runtime";
import {  } from "react-relay";

declare const ipc: IPC;

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace globalThis {
    let ipc: IPC;
}

if(import.meta.vitest) {
    const { vi } = import.meta.vitest;
    globalThis.ipc = {
        cwd: vi.fn().mockResolvedValue("cwd"),
        graphql: vi.fn(),
    };
}

const network = Network.create(async (params, variables): Promise<GraphQLResponse> => {
    if(params.text) {
        const result = await ipc.graphql(params.text, variables);
        return {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            data: result.data || undefined!,
            errors: result.errors?.map(err => ({
                message: err.message,
                locations: err.locations?.slice(),
            })),
            extensions: result.extensions,
        };
    }
    return Promise.reject();
});

const store = new Store(new RecordSource());

export const relayEnv = new Environment({ network, store });

export const acalyle = {
    cwd: ipc.cwd,
};
