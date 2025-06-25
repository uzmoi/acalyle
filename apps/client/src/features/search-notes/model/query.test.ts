import { describe, expect, test } from "vitest";
import { parseQuery, type QueryItem } from "./query";

// query item helper
const h = {
  word: (value: string, exclude = false): Partial<QueryItem> => ({
    type: "word",
    value,
    exclude,
  }),
  tag: (
    symbol: string,
    prop?: string,
    exclude = false,
  ): Partial<QueryItem> => ({
    type: "tag",
    symbol,
    prop: prop ?? null,
    exclude,
  }),
};

describe("parser", () => {
  type Case = [string, ...Partial<QueryItem>[]];

  test.each([
    [""],
    ["hoge", h.word("hoge")],
    ["hoge fuga", h.word("hoge"), h.word("fuga")],
    ['" ', h.word('"')],
    ["-", h.word("-")],
    ["-hoge", h.word("hoge", true)],
    ["--hoge", h.word("-hoge", true)],
    // quote
    ['""'],
    ['" "', h.word(" ")],
    ['"a"b', h.word('"a"b')],
    ['a"b"', h.word('a"b"')],
    ['"\\""', h.word('"')],
    ['"#tag"', h.word("#tag")],
    ['-"a"', h.word("a", true)],
    // tag
    ["#tag", h.tag("#tag")],
    ["@hoge:fuga", h.tag("@hoge", "fuga")],
    ["-#tag", h.tag("#tag", undefined, true)],
    ["-@hoge:fuga", h.tag("@hoge", "fuga", true)],
  ] satisfies Case[])("parse %o", (queryString, ...items) => {
    expect(parseQuery(queryString)).toMatchObject({ items });
  });
});
