import { Err, Ok, Result } from "@acalyle/fp";
import type { TypedDocumentNode } from "@graphql-typed-document-node/core";
import type { JsonValue } from "emnorst";
import { print } from "graphql";
import type { JsonValueable } from "../lib/types";

const jsonBlob = (json: JsonValueable): Blob =>
    new Blob([JSON.stringify(json)], { type: "application/json" });

export const graphqlBodyInit = (
    query: string,
    variables?: Record<string, JsonValueable>,
    uploadables?: Record<string, Blob>,
): BodyInit => {
    const operations = { query, variables };

    if (uploadables == null) {
        return JSON.stringify(operations);
    }

    const body = new FormData();

    body.append("operations", jsonBlob(operations));

    const map: Record<string, string> = {};

    for (const [key, blob] of Object.entries(uploadables)) {
        map[key] = key;
        body.append(key, blob);
    }

    body.append("map", jsonBlob(map));

    return body;
};

type GraphQLResult<T> = {
    errors?: readonly JsonValue[];
    data: T & (Record<string, JsonValue> | null | undefined);
    extensions?: Record<string, JsonValue>;
};

export type NetworkError =
    | { type: "network_error"; error: Error | null }
    | { type: "http_error"; status: number; body: string }
    | { type: "invalid_json" };

export class Network {
    private static readonly _resourceBaseUrl = `${location.origin}/api/`;
    private static readonly _apiEndpointUrl = `${location.origin}/api`;
    resolveResource(path: string): URL {
        return new URL(path, Network._resourceBaseUrl);
    }
    async gql<R, V extends Record<string, JsonValueable>>(
        documentNode: TypedDocumentNode<R, V>,
        variables?: V,
    ): Promise<GraphQLResult<R>> {
        return this.graphql(documentNode, variables!).then(result => {
            return result.unwrap();
        });
    }
    async graphql<R, V extends Record<string, JsonValueable>>(
        documentNode: TypedDocumentNode<R, V>,
        variables: V,
    ): Promise<Result<GraphQLResult<R>, NetworkError>> {
        const query = print(documentNode);

        const res = await fetch(Network._apiEndpointUrl, {
            method: "POST",
            body: graphqlBodyInit(query, variables),
        }).catch(error => {
            return Err<NetworkError>({
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
                return Ok(result as unknown as GraphQLResult<R>);
            } catch {
                return Err<NetworkError>({ type: "invalid_json" });
            }
        } else {
            const errorResponseBody = await res.text();
            return Err<NetworkError>({
                type: "http_error",
                status: res.status,
                body: errorResponseBody,
            });
        }
    }
}
