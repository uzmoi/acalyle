import { BasicLogger } from "@acalyle/logger";
import type { AcalyleClientContext } from "./context";
import { Network } from "./network";

export class AcalyleClient {
    readonly context: AcalyleClientContext = {
        logger: new BasicLogger("acalyle"),
    };
    readonly net = new Network();
}
