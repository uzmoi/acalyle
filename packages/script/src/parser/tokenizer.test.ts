import { describe, expect, test } from "vitest";
import { type Token, type TokenType, Tokenizer } from "./tokenizer";

const tokenize = (source: string): Token[] => {
    return new Tokenizer(source).tokenize();
};

const tokens = (...tokens: [type: TokenType, value: string][]): Token[] => {
    return tokens.map(([type, value]) => {
        return { type, value };
    });
};

test("empty", () => {
    expect(tokenize("")).toEqual([]);
});

test("keyword", () => {
    expect(tokenize("if")).toEqual(tokens(["Keyword", "if"]));
});

describe("ident", () => {
    test("ident", () => {
        expect(tokenize("hoge")).toEqual(tokens(["Ident", "hoge"]));
    });
    test.todo("escape", () => {
        expect(tokenize("hoge\\\\")).toEqual(tokens(["Ident", "hoge\\\\"]));
    });
    test.todo("escape keyword", () => {
        expect(tokenize("\\if")).toEqual(tokens(["Ident", "\\if"]));
    });
});

describe("string", () => {
    test("string", () => {
        expect(tokenize('"hoge"')).toEqual(tokens(["String", '"hoge"']));
    });
    test.todo("escape", () => {
        expect(tokenize('"\\\\"')).toEqual(tokens(["String", '"\\\\"']));
    });
    test.todo("$ident", () => {
        expect(tokenize('"$hoge"')).toEqual(
            tokens(["String", '"$'], ["Ident", "hoge"], ["String", '"']),
        );
    });
    test.todo("{expr}", () => {
        expect(tokenize('"{hoge}"')).toEqual(tokens(["String", '"hoge"']));
    });
});

test("whitespace", () => {
    expect(tokenize(" ")).toEqual(tokens(["Whitespace", " "]));
});
