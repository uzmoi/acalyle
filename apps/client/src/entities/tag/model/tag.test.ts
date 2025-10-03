import { describe, expect, test } from "vitest";
import { parseTag, tagToString } from "./tag";
import type { TagObject, TagSymbol } from "./types";

const tag = (symbol: string, prop?: string): TagObject => ({
  symbol: symbol as TagSymbol,
  prop,
});

describe("parseTag", () => {
  describe("symbol only", () => {
    test("nameが1文字", () => {
      expect(parseTag("#a")).toStrictEqual(tag("#a"));
    });

    test.each(["#normal", "@control", "*unique"])("%s", symbol => {
      expect(parseTag(symbol)).toStrictEqual(tag(symbol));
    });
  });

  describe("with prop", () => {
    test("prop", () => {
      expect(parseTag("@tag:prop")).toStrictEqual(tag("@tag", "prop"));
    });

    test("empty prop", () => {
      expect(parseTag("@tag:")).toStrictEqual(tag("@tag", ""));
    });
  });

  test("空文字列は無効", () => {
    expect(parseTag("")).toBeNull();
  });

  test("headの無いタグは無効", () => {
    expect(parseTag("invalid")).toBeNull();
  });

  test("symbol が head のみは無効", () => {
    expect(parseTag("#")).toBeNull();
    expect(parseTag("#:property")).toBeNull();
  });

  test("制御文字が含まれていると無効", () => {
    expect(parseTag("#\t")).toBeNull();
  });
});

describe("toString", () => {
  test("symbol only", () => {
    expect(tagToString(tag("#tag"))).toBe("#tag");
  });

  test("with empty prop", () => {
    expect(tagToString(tag("@tag", ""))).toBe("@tag");
  });

  test("with prop", () => {
    expect(tagToString(tag("@tag", "prop"))).toBe("@tag:prop");
  });
});
