import { Result } from "@acalyle/fp";
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

export type NetworkError =
    | { type: "network_error"; error: Error | null }
    | { type: "http_error"; status: number; body: string }
    | { type: "invalid_json" };

export class Network {
    private static readonly _resourceBaseUrl = new URL("api/", location.origin);
    private static readonly _apiEndpointUrl = new URL("api", location.origin);
    resolveResource(path: string): URL {
        return new URL(path, Network._resourceBaseUrl);
    }
    async gql<T, U extends Record<string, JsonValueable>>(
        documentNode: import("graphql").DocumentNode,
        variables?: U,
    ): Promise<GraphQLResult & { data: T }> {
        return this.graphql(documentNode, variables).then(result => {
            return result.getOrThrow() as GraphQLResult & { data: T };
        });
    }
    async graphql(
        documentNode: import("graphql").DocumentNode,
        variables?: Record<string, JsonValueable>,
    ): Promise<Result<GraphQLResult, NetworkError>> {
        const query = documentNode.loc?.source.body ?? "";

        const res = await fetch(Network._apiEndpointUrl, {
            method: "POST",
            body: graphqlBodyInit(query, variables),
        }).catch(error => {
            return Result.err<NetworkError>({
                type: "network_error",
                error: error instanceof Error ? error : null,
            });
        });

        if (res instanceof Result) {
            return res;
        }

        if (res.ok) {
            try {
                const result = await (res.json() as Promise<JsonValue>);
                return Result.ok(result as GraphQLResult);
            } catch {
                return Result.err({ type: "invalid_json" });
            }
        } else {
            const errorResponseBody = await res.text();
            return Result.err({
                type: "http_error",
                status: res.status,
                body: errorResponseBody,
            });
        }
    }
}
