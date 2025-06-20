import { describe, expect, test } from "vitest";
import { parseQuery, type QueryItem } from "./query";

// query item helper
const h = {
  ignore: {
    type: "ignore",
    value: expect.any(String) as string,
  } satisfies QueryItem,
  word: (value: string): QueryItem => ({ type: "word", value }),
  tag: (symbol: string, prop?: string): QueryItem => ({
    type: "tag",
    symbol,
    prop: prop ?? null,
  }),
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
    ['"#tag"', h.word("#tag")],
    // tag
    ["#tag", h.tag("#tag")],
    ["@hoge:fuga", h.tag("@hoge", "fuga")],
  ] satisfies Case[])("parse %o", (queryString, ...items) => {
    expect(parseQuery(queryString)).toEqual({ items });
  });
});
