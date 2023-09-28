import type { BasicLogger } from "@acalyle/logger";
import type { JsonValueable } from "../lib/types";

export type AcalyleClientContext = {
    logger: BasicLogger<JsonValueable>;
};
