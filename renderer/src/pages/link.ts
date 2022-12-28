import { type LinkBuilder, link as createLink } from "~/shared/router";
import type { RootRoutes } from "./routes";

export const link: LinkBuilder<RootRoutes["path"]> = (
    ...args: unknown[]
): never => {
    // @ts-expect-error めんどいので適当にお茶を濁してしまった
    const x = createLink<RootRoutes>()(...args);
    return ("#" + x) as never;
};
