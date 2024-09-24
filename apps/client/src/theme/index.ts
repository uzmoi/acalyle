import type { IfUnion } from "emnorst";
import { xxHash32 } from "js-xxhash";
import type { Theme } from "./theme";

export const theme = <
    S extends keyof Theme,
    K extends S extends S ? keyof Theme[S] : never,
>(
    key: IfUnion<S, S, `${S}-${K}`>,
): `var(--${string})` =>
    `var(--${import.meta.env.DEV ? key : xxHash32(key).toString(16)})`;

export type * from "./theme";
