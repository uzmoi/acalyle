import { BasicLogger } from "@acalyle/logger";
import { simpleConsoleTransport } from "./console";

export const logger = /* #__PURE__ */ new BasicLogger<unknown>("acalyle");

if (import.meta.env.DEV) {
  logger.attachTransport(simpleConsoleTransport);
}
