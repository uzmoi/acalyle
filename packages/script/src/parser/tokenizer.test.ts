import { describe, expect, test } from "vitest";
import { type Token, type TokenType, Tokenizer } from "./tokenizer";

const tokenize = (source: string): Token[] => {
    return new Tokenizer(source).tokenize();
};

const tokens = (...tokens: [type: TokenType, value: string][]): Token[] => {
    let i = 0;
    return tokens.map(([type, value]): Token => {
        return { type, value, loc: [i, (i += value.length)] };
    });
};

test("empty", () => {
    expect(tokenize("")).toEqual([]);
});

test("Keyword", () => {
    expect(tokenize("if")).toEqual(tokens(["Keyword", "if"]));
});

describe("Ident", () => {
    test("ident", () => {
        expect(tokenize("hoge")).toEqual(tokens(["Ident", "hoge"]));
    });
    test("escape", () => {
        expect(tokenize("hoge\\\\")).toEqual(tokens(["Ident", "hoge\\\\"]));
    });
    test("escape keyword", () => {
        expect(tokenize("\\if")).toEqual(tokens(["Ident", "\\if"]));
    });
});

describe("Punctuator", () => {
    test("punctuator", () => {
        expect(tokenize("++")).toEqual(tokens(["Punctuator", "++"]));
    });
});

describe("Delimiter", () => {
    test("delimiter", () => {
        expect(tokenize("()")).toEqual(
            tokens(["Delimiter", "("], ["Delimiter", ")"]),
        );
    });
});

describe("Number", () => {
    test("number", () => {
        expect(tokenize("42")).toEqual(tokens(["Number", "42"]));
    });
});

describe("String", () => {
    test("string", () => {
        expect(tokenize('"hoge"')).toEqual(tokens(["String", '"hoge"']));
    });
    test("escape", () => {
        expect(tokenize('"\\\\"')).toEqual(tokens(["String", '"\\\\"']));
    });
    test("$ident", () => {
        expect(tokenize('"$hoge"')).toEqual(
            tokens(["String", '"$'], ["Ident", "hoge"], ["String", '"']),
        );
    });
    test.todo("empty ident", () => {
        expect(tokenize('"$"')).toEqual(tokens(["String", '"$"']));
    });
    test.todo("{expr}", () => {
        expect(tokenize('"{hoge}"')).toEqual(
            tokens(["String", '"{'], ["Ident", "hoge"], ["String", '}"']),
        );
    });
});

test("Whitespace", () => {
    expect(tokenize(" ")).toEqual(tokens(["Whitespace", " "]));
});

describe("Comment", () => {
    test("singleline comment", () => {
        expect(tokenize("// comment\n")).toEqual(
            tokens(["Comment", "// comment"], ["Whitespace", "\n"]),
        );
    });
    test("multiline comment", () => {
        expect(tokenize("/* comment */")).toEqual(
            tokens(["Comment", "/* comment */"]),
        );
    });
    test("nested multiline comment", () => {
        expect(tokenize("/* /* comment */ */")).toEqual(
            tokens(["Comment", "/* /* comment */ */"]),
        );
    });
    test("mlc+mlc", () => {
        expect(tokenize("/**//**/")).toEqual(
            tokens(["Comment", "/**/"], ["Comment", "/**/"]),
        );
    });
});
