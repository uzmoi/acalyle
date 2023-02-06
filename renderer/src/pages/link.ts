import { link as createLink } from "~/shared/router";
import type { RootRoutes } from "./routes";

export const link = createLink<RootRoutes["path"]>;
