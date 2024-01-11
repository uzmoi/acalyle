import type { JsonPrimitive } from "emnorst";

export type JsonValueable =
    | JsonPrimitive
    | { toJSON(): unknown }
    | { readonly [key: string]: JsonValueable | undefined }
    | readonly JsonValueable[];
