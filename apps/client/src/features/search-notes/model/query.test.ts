import { describe, expect, test } from "vitest";
import { parseQuery, type QueryItem } from "./query";

// query item helper
const h = {
  ignore: {
    type: "ignore",
    value: expect.any(String) as string,
  } satisfies QueryItem,
  word: (value: string): QueryItem => ({ type: "word", value }),
};

describe("parser", () => {
  type Case = [string, ...QueryItem[]];

  test.each([
    [""],
    ["hoge", h.word("hoge")],
    ["hoge fuga", h.word("hoge"), h.ignore, h.word("fuga")],
    ['" ', h.word('"'), h.ignore],
    // quote
    ['""'],
    ['" "', h.word(" ")],
    ['"a"b', h.word('"a"b')],
    ['a"b"', h.word('a"b"')],
    ['"\\""', h.word('"')],
  ] satisfies Case[])("parse %o", (queryString, ...items) => {
    expect(parseQuery(queryString)).toEqual({ items });
  });
});
