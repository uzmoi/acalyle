import type { JsonValue } from "emnorst";
import type { JsonValueable } from "../lib/types";

export const graphqlBodyInit = (
    query: string,
    variables?: Record<string, JsonValueable>,
    uploadables?: Record<string, Blob>,
): BodyInit => {
    const operations = JSON.stringify({
        query,
        variables,
    });

    if (uploadables == null) {
        return operations;
    }

    const map = JSON.stringify(
        uploadables,
        (key, value: Record<string, Blob> | Blob) => key || value,
    );
    const body = new FormData();

    body.append(
        "operations",
        new Blob([operations], {
            type: "application/json",
        }),
    );

    body.append(
        "map",
        new Blob([map], {
            type: "application/json",
        }),
    );

    for (const [key, blob] of Object.entries(uploadables)) {
        body.append(key, blob);
    }

    return body;
};

type GraphQLResult = {
    errors?: readonly JsonValue[];
    data?: Record<string, JsonValue> | null;
    extensions?: Record<string, JsonValue>;
};

export class Network {
    private static readonly resourceBaseUrl = new URL("api/", location.origin);
    private static readonly apiBaseUrl = new URL("api/", location.origin);
    resolveResource(path: string): URL {
        return new URL(path, Network.resourceBaseUrl);
    }
    async gql<T, U extends Record<string, JsonValueable>>(
        documentNode: import("graphql").DocumentNode,
        variables?: U,
    ): Promise<GraphQLResult & { data: T }> {
        return this.graphql(documentNode, variables) as Promise<
            GraphQLResult & { data: T }
        >;
    }
    async graphql(
        documentNode: import("graphql").DocumentNode,
        variables?: Record<string, JsonValueable>,
    ): Promise<GraphQLResult> {
        const query = documentNode.loc?.source.body ?? "";

        const res = await fetch(Network.apiBaseUrl, {
            method: "POST",
            body: graphqlBodyInit(query, variables),
        });

        if (res.ok) {
            try {
                const result = await (res.json() as Promise<JsonValue>);
                return result as GraphQLResult;
            } catch (error) {
                throw new Error("invalid_json", { cause: error });
            }
        } else {
            throw new Error("server_error");
        }
    }
}
