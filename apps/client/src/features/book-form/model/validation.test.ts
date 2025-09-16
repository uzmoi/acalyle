import { describe, expect, test } from "vitest";
import { normalizeBookHandle } from "./validation";

describe("Normalize Book Handle", () => {
  test("Preserve valid characters.", () => {
    expect(normalizeBookHandle("az_09")).toBe("az_09");
  });

  test("Convert to lowercase.", () => {
    expect(normalizeBookHandle("HOGE")).toBe("hoge");
  });

  test("Preserve consecutive underscores.", () => {
    expect(normalizeBookHandle("a__b")).toBe("a__b");
  });

  test("Convert consecutive invalid characters into a single underscore.", () => {
    expect(normalizeBookHandle("a  b")).toBe("a_b");
  });

  test("Preserve leading and trailing underscores.", () => {
    expect(normalizeBookHandle("__a__")).toBe("__a__");
  });

  test("Trim invalid characters.", () => {
    // cspell:ignore vanitas vanitatum et omnia vanitas
    expect(
      normalizeBookHandle("ᓀ‸ᓂ 「Vanitas vanitatum et omnia vanitas.」"),
    ).toBe("vanitas_vanitatum_et_omnia_vanitas");
  });

  test("Remove accents.", () => {
    // cspell:ignore prière
    expect(normalizeBookHandle("La prière")).toBe("la_priere");
  });

  test("Trim to max length.", () => {
    expect(normalizeBookHandle("🌱" + "a".repeat(1000))).toBe("a".repeat(100));
  });
});
