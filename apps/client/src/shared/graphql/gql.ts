import type { TypedDocumentNode } from "@graphql-typed-document-node/core";
import { Err, Ok, Result } from "@uzmoi/ut/fp";
import type { JsonValue } from "@uzmoi/ut/types";
import { print, type OperationDefinitionNode } from "graphql";
import { logger } from "../logger";
import { invariant } from "../utils";
import type { GqlFnError } from "./errors";

const jsonBlob = (json: string): Blob =>
  new Blob([json], { type: "application/json" });

const graphqlBodyInit = (
  query: string,
  variables?: Record<string, unknown>,
  uploadables?: Record<string, Blob>,
): BodyInit => {
  const operations = JSON.stringify({ query, variables });

  if (uploadables == null) {
    return operations;
  }

  const body = new FormData();

  body.append("operations", jsonBlob(operations));

  const map: Record<string, string> = {};

  for (const [key, blob] of Object.entries(uploadables)) {
    map[key] = key;
    body.append(key, blob);
  }

  body.append("map", jsonBlob(JSON.stringify(map)));

  return body;
};

let requestId = 1;

export const gql = async <TVariables extends Record<string, unknown>, TResult>(
  document: TypedDocumentNode<TResult, TVariables>,
  variables: NoInfer<TVariables>,
): Promise<Result<TResult, GqlFnError>> => {
  const l = logger.child("gql").child(`${requestId++}`);

  const query = print(document);
  const body = graphqlBodyInit(query, variables);

  let res: Response;
  try {
    const def = document.definitions[0] as OperationDefinitionNode;
    l.debug("fetch/start", def.name?.value, { query, variables });
    // using _ = l.trace("fetch", { query, variables });

    res = await fetch(`${location.origin}/api`, {
      method: "POST",
      body,
    });
  } catch (error) {
    invariant(error instanceof Error, "unknown error", { cause: error });
    return Err<GqlFnError>({ name: "NetworkError", error });
  } finally {
    l.debug("fetch/end");
  }

  if (!res.ok) {
    const body = await res.text();

    l.info("server-error", res.status, body);

    return Err<GqlFnError>({ name: "ServerError", status: res.status, body });
  }

  try {
    // https://developer.mozilla.org/ja/docs/Web/API/AbortController#%E4%BE%8B
    // fetchが完了してからsignalがabortされるとここでエラーが発生する。
    // 今はAbortSignalを渡していないので、考慮は不要。
    const result = await (res.json() as Promise<JsonValue>);
    // const r = v.parse(GraphQLResultSchema, result);
    const { data } = result as unknown as GraphQLResult<TResult>;

    l.debug("result", data);

    return Ok(data);
  } catch (error) {
    l.warn("invalid-response", error);

    // https://fetch.spec.whatwg.org/#dom-body-json
    if (error instanceof SyntaxError) {
      return Err<GqlFnError>({ name: "InvalidResponseError" });
    }

    return Err<GqlFnError>({ name: "InvalidResponseError" });
  }
};

// const GraphQLResultSchema = v.object({
//     errors: v.optional(v.array(v.unknown())),
//     data: v.unknown(),
//     extensions: v.optional(v.record(v.unknown())),
// });

interface GraphQLResult<T> {
  errors?: readonly JsonValue[];
  data: T & (Record<string, JsonValue> | null | undefined);
  extensions?: Record<string, JsonValue>;
}
