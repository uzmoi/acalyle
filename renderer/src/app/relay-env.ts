// eslint-disable-next-line import/no-extraneous-dependencies
import {
    Environment,
    GraphQLResponse,
    Network,
    RecordSource,
    Store,
} from "relay-runtime";
// eslint-disable-next-line import/no-extraneous-dependencies
import { LogFunction } from "relay-runtime/lib/store/RelayStoreTypes";
import { acalyle } from "./ipc";

// prettier-ignore
const network = Network.create(async (
    request,
    variables,
    _cacheConfig,
    uploadables,
): Promise<GraphQLResponse> => {
    if(request.text) {
        let bufs: Record<string, ArrayBuffer> | undefined;
        if(uploadables != null) {
            const bufPromises = Object.entries(uploadables).map(async ([key, value]) => {
                const arrbuf = await value.arrayBuffer();
                return [key, arrbuf] as const;
            });
            const bufEntries = await Promise.all(bufPromises);
            bufs = Object.fromEntries(bufEntries);
        }
        const result = await acalyle.graphql(
            JSON.stringify({
                query: request.text,
                variables,
            }),
            bufs,
        );
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

const log: LogFunction = logEvent => {
    switch (logEvent.name) {
        case "network.start":
        case "network.next":
        case "network.info":
        case "network.error":
        case "network.complete":
        case "network.unsubscribe":
            console.log(logEvent);
            break;
    }
};

export const relayEnv = new Environment({ network, store, log });
