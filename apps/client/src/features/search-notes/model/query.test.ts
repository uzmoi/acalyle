import { describe, expect, test } from "vitest";
import { parseQuery, type QueryItem } from "./query";

// query item helper
const h = {
  word: (
    value: string,
    { quoted = false, exclude = false } = {},
  ): Partial<QueryItem> => ({
    type: "word",
    exclude,
    value,
    quoted,
  }),
  tag: (
    symbol: string,
    prop?: string,
    { exclude = false } = {},
  ): Partial<QueryItem> => ({
    type: "tag",
    exclude,
    symbol,
    prop: prop ?? null,
  }),
};

describe("parser", () => {
  type Case = [string, ...Partial<QueryItem>[]];

  test.each([
    [""],
    ["hoge", h.word("hoge")],
    ["hoge fuga", h.word("hoge"), h.word("fuga")],
    ["-", h.word("-")],
    ["-hoge", h.word("hoge", { exclude: true })],
    ["--hoge", h.word("-hoge", { exclude: true })],
    // quote
    ['""'],
    ['" "', h.word(" ", { quoted: true })],
    ['"a"b', h.word('"a"b')],
    ['a"b"', h.word('a"b"')],
    ['" ', h.word('"')],
    ['"\\""', h.word('"', { quoted: true })],
    ['"#tag"', h.word("#tag", { quoted: true })],
    ['-"a"', h.word("a", { quoted: true, exclude: true })],
    // tag
    ["#tag", h.tag("#tag")],
    ["@hoge:fuga", h.tag("@hoge", "fuga")],
    ["-#tag", h.tag("#tag", undefined, { exclude: true })],
    ["-@hoge:fuga", h.tag("@hoge", "fuga", { exclude: true })],
  ] satisfies Case[])("parse %o", (queryString, ...items) => {
    expect(parseQuery(queryString)).toMatchObject({ items });
  });
});
