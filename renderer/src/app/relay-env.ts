import { Environment, GraphQLResponse, Network, RecordSource, Store } from "relay-runtime";
import { acalyle } from "./ipc";

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
        const result = await acalyle.graphql(request.text, variables, bufs);
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
