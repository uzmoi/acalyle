import { link as createLink } from "@acalyle/router";
import type { RootRoutes } from "./routes";

export const link = createLink<RootRoutes["path"]>;
