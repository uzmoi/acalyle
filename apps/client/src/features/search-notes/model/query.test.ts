import { describe, expect, test } from "vitest";
import {
  type QueryItem,
  type QueryToken,
  appendTag,
  lexQuery,
  parseQuery,
  printServerQuery,
  removeTag,
} from "./query";

// query token helper
const t = {
  ignore: (): QueryToken => ({
    type: "ignore",
    content: expect.stringMatching(/ */) as string,
  }),
  op: (op: string): QueryToken => ({ type: "op", content: op }),
  word: (content: string): QueryToken => ({ type: "word", content }),
  quoted: (content: string): QueryToken => ({ type: "word:quoted", content }),
  tag: (content: string): QueryToken => ({ type: "tag", content }),
};

describe("lexQuery", () => {
  test("empty", () => {
    expect(lexQuery("").toArray()).toEqual([]);
  });
  test("lexQuery", () => {
    expect(lexQuery('hoge -"\\\\" #tag -@tag:prop ').toArray()).toMatchObject([
      t.word("hoge"),
      t.ignore(),
      t.op("-"),
      t.quoted('"\\\\"'),
      t.ignore(),
      t.tag("#tag"),
      t.ignore(),
      t.op("-"),
      t.tag("@tag:prop"),
      t.ignore(),
    ]);
  });
});

// query item helper
const h = {
  word: (value: string, { exclude = false } = {}): QueryItem => ({
    type: "word",
    exclude,
    value,
  }),
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
    ['""', h.word("")],
    ['" "', h.word(" ")],
    ['"a"b', h.word('"a"b')],
    ['a"b"', h.word('a"b"')],
    ['" ', h.word('"')],
    ['"\\""', h.word('"')],
    ['"#tag"', h.word("#tag")],
    ['-"a"', h.word("a", { exclude: true })],
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

describe("update query", () => {
  describe("removeTag", () => {
    test.each([
      ['"#tag"', '"#tag"'],
      ["#tag", ""],
      [" #tag ", " "],
      ["  hoge   #tag  fuga  ", "  hoge  fuga  "],
    ])("%o", (query, expected) => {
      expect(removeTag(query, "#tag")).toBe(expected);
    });
  });

  describe("appendTag", () => {
    test.each([
      ["", "#tag"],
      ["hoge ", "hoge #tag"],
      ["hoge", "hoge #tag"],
    ])("%o", (query, expected) => {
      expect(appendTag(query, "#tag")).toBe(expected);
    });
    test("replace tag", () => {
      expect(appendTag("@tag:fuga", "@tag")).toBe("@tag");
    });
  });
});
