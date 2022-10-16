import { Environment, GraphQLResponse, Network, RecordSource, Store } from "relay-runtime";
import { acalyle } from "./ipc";

const network = Network.create(async (request, variables): Promise<GraphQLResponse> => {
    if(request.text) {
        const result = await acalyle.graphql(request.text, variables);
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
