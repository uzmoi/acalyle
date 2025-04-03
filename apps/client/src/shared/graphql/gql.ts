import type { Result } from "@acalyle/fp";
import type { TypedDocumentNode } from "@graphql-typed-document-node/core";
import type { JsonValue } from "@uzmoi/ut/types";
import { acalyle } from "~/app/main";
import type { GqlFnError } from "./errors";

export const gql = async <
  TVariables extends Record<string, JsonValue>,
  TResult,
>(
  document: TypedDocumentNode<TResult, TVariables>,
  variables: TVariables,
): Promise<Result<TResult, GqlFnError>> => {
  const gql = acalyle.net.graphql.bind(acalyle.net);
  const result = await gql(document, variables);
  return result
    .map(result => result.data)
    .mapE((error): GqlFnError => {
      switch (error.type) {
        case "network_error": {
          return { name: "NetworkError" };
        }
        case "http_error": {
          return { name: "ServerError" };
        }
        case "invalid_json": {
          return { name: "InvalidResponseError" };
        }
        // No Default: Returned in all cases.
      }
    });
};
