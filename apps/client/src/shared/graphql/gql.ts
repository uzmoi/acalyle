import { Err, Ok, Result } from "@acalyle/fp";
import type { TypedDocumentNode } from "@graphql-typed-document-node/core";
import type { JsonValue } from "@uzmoi/ut/types";
import { print } from "graphql";
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

export const gql = async <TVariables extends Record<string, unknown>, TResult>(
  document: TypedDocumentNode<TResult, TVariables>,
  variables: NoInfer<TVariables>,
): Promise<Result<TResult, GqlFnError>> => {
  // const id = context.genId("gql");
  // const logger = context.logger.child("gql").child(id);
  // using _ = logger.use();

  const query = print(document);
  const body = graphqlBodyInit(query, variables);

  let res: Response;
  try {
    // using _ = logger.trace("fetch", id, { query, variables });

    res = await fetch(`${location.origin}/api`, {
      method: "POST",
      body,
    });
  } catch (error) {
    invariant(error instanceof Error, "unknown error", { cause: error });
    return Err<GqlFnError>({ name: "NetworkError", error });
  }

  if (!res.ok) {
    const body = await res.text();
    return Err<GqlFnError>({ name: "ServerError", status: res.status, body });
  }

  try {
    // https://developer.mozilla.org/ja/docs/Web/API/AbortController#%E4%BE%8B
    // fetchが完了してからsignalがabortされるとここでエラーが発生する。
    // 今はAbortSignalを渡していないので、考慮は不要。
    const result = await (res.json() as Promise<JsonValue>);
    // const r = v.parse(GraphQLResultSchema, result);

    // logger.debug("result", id, result);

    return Ok((result as unknown as GraphQLResult<TResult>).data);
  } catch (error) {
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
