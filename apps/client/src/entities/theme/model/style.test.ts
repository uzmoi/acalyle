import { expect, test } from "vitest";
import { tth } from "./style";

test("tth", () => {
  expect(tth("1px solid $ui-border")).toBe("1px solid var(--ui-border)");
});

test("tth.style", () => {
  expect(tth.style("app-bg", "ui-text")).toEqual({
    backgroundColor: "var(--app-bg)",
    color: "var(--ui-text)",
  });
});
