/** @public */
export { type RegisterRebrand, rebrand } from "./rebrand";

// oxlint-disable-next-line func-style, no-inner-declarations
export function invariant(
  condition: boolean,
  message: string | (() => string),
  options?: ErrorOptions,
): asserts condition {
  if (condition) return;
  throw new Error(
    `Invariant failed: ${typeof message === "function" ? message() : message}`,
    options,
  );
}
