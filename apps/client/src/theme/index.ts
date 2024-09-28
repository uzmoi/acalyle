import hash from "@emotion/hash";
import type { IfUnion } from "emnorst";
import type { Theme } from "./theme";

export const varName = (key: string): string =>
    import.meta.env.DEV ? key : hash(key);

export const theme = <
    S extends keyof Theme,
    K extends S extends S ? keyof Theme[S] : never,
>(
    key: IfUnion<S, S, `${S}-${K}`>,
): `var(--${string})` => `var(--${varName(key)})`;

export type * from "./theme";
