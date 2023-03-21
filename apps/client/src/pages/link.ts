import { link as createLink } from "@acalyle/router";
import type { BookRoute } from "./routes";

export const link = createLink<BookRoute["path"]>;
