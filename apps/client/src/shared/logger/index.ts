import { BasicLogger } from "@acalyle/logger";
import { simpleConsoleTransport } from "./console";

export const logger = /* #__PURE__ */ new BasicLogger("acalyle");

if (import.meta.env.DEV) {
  // eslint-disable-next-line pure-module/pure-module
  logger.attachTransport(simpleConsoleTransport);
}
