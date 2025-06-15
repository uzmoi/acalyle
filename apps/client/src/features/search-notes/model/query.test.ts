import { describe, expect, test } from "vitest";
import { parseQuery, type QueryItem } from "./query";

// query item helper
const h = {
  word: (value: string): QueryItem => ({ type: "word", value }),
};

describe("parser", () => {
  type Case = [string, ...QueryItem[]];

  test.each([
    [""],
    ["hoge", h.word("hoge")],
    ["hoge fuga", h.word("hoge"), h.word("fuga")],
    ['" ', h.word('"')],
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
