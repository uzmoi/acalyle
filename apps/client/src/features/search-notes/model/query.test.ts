import { describe, expect, test } from "vitest";
import {
  parseQuery,
  lexQuery,
  type QueryItem,
  type QueryToken,
  printServerQuery,
} from "./query";

// query item helper
const h = {
  word: (
    value: string,
    { quoted = false, exclude = false } = {},
  ): QueryItem => ({ type: "word", exclude, quoted, value }),
  tag: (
    symbol: string,
    prop: string | null,
    { exclude = false } = {},
  ): QueryItem => ({ type: "tag", exclude, symbol, prop }),
};

describe("parser", () => {
  type Case = [string, ...QueryItem[]];

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
    ["#tag", h.tag("#tag", null)],
    ["@hoge:fuga", h.tag("@hoge", "fuga")],
    ["-#tag", h.tag("#tag", null, { exclude: true })],
    ["-@hoge:fuga", h.tag("@hoge", "fuga", { exclude: true })],
  ] satisfies Case[])("parse %o", (queryString, ...items) => {
    expect(parseQuery(queryString).toArray()).toMatchObject(items);
  });
});

describe("printServerQuery", () => {
  test("hoge fuga", () => {
    expect(printServerQuery([h.word("hoge"), h.word("fuga")])).toBe(
      '"hoge" "fuga"',
    );
  });
});

// query token helper
const t = {
  ignore: (): QueryToken => ({
    type: "ignore",
    content: expect.stringMatching(/ */) as string,
  }),
  word: (
    content: string,
    { quoted = false, exclude = false } = {},
  ): QueryToken => ({ type: "word", exclude, quoted, content }),
  tag: (
    symbol: string,
    prop: string | null,
    { exclude = false } = {},
  ): QueryToken => ({ type: "tag", exclude, symbol, prop }),
};

test("lexQuery", () => {
  expect(lexQuery('hoge -"\\\\" #tag -@tag:prop ')).toMatchObject([
    t.ignore(),
    t.word("hoge"),
    t.ignore(),
    t.word('"\\\\"', { exclude: true, quoted: true }),
    t.ignore(),
    t.tag("#tag", null),
    t.ignore(),
    t.tag("@tag", "prop", { exclude: true }),
  ]);
});
