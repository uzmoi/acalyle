import { assert } from "emnorst";
import type { Stack } from "../types";

export type TokenType =
    | "Ident"
    | "Keyword"
    | "Number"
    | "String"
    | "Whitespace";

export type Token = {
    type: TokenType;
    value: string;
};

export type Keyword = (typeof keywords)[number];

const keywords = ["fn", "return", "true", "false", "if", "else"] as const;

// TODO: JSの正規表現の\sに頼らずに定義したい
// https://tc39.es/ecma262/multipage/text-processing.html#sec-compiletocharset
// https://tc39.es/ecma262/multipage/ecmascript-language-lexical-grammar.html#prod-WhiteSpace
// https://tc39.es/ecma262/multipage/ecmascript-language-lexical-grammar.html#prod-LineTerminator
const isWhitespace = (char: string) => /\s/.test(char);

const enum TokenizeState {
    /* eslint-disable @typescript-eslint/naming-convention */
    Root,
    Escape,
    Ident,
    Number,
    String,
    Whitespace,
    /* eslint-enable @typescript-eslint/naming-convention */
}

export class Tokenizer {
    constructor(readonly source: string) {}
    private _stack: Stack<TokenizeState> = [];
    private _current = "";
    tokens: Token[] = [];
    private _pushToken(type: TokenType) {
        this.tokens.push({ type, value: this._current });
        this._current = "";
    }
    private _nextToken(type: TokenType, char: string | undefined) {
        this._pushToken(type);
        this._stack.pop();
        if (char !== undefined) {
            this.next(char);
        }
    }
    next(char: string | undefined) {
        const state = this._stack.at(-1) ?? TokenizeState.Root;
        switch (state) {
            case TokenizeState.Root: {
                if (char === undefined) return;
                switch (char) {
                    case "\\": {
                        this._stack.push(
                            TokenizeState.Ident,
                            TokenizeState.Escape,
                        );
                        break;
                    }
                    case /[a-z]/i.test(char) && char: {
                        this._stack.push(TokenizeState.Ident);
                        break;
                    }
                    case /\d/.test(char) && char: {
                        this._stack.push(TokenizeState.Number);
                        break;
                    }
                    case '"': {
                        this._stack.push(TokenizeState.String);
                        break;
                    }
                    case isWhitespace(char) && char: {
                        this._stack.push(TokenizeState.Whitespace);
                        break;
                    }
                    default:
                        throw new SyntaxError(`Unknown charactor: "${char}"`);
                }
                this._current += char;
                break;
            }
            case TokenizeState.Escape: {
                if (char === undefined) {
                    throw new SyntaxError("Unexpected end of input.");
                } else {
                    this._current += char;
                    this._stack.pop();
                }
                break;
            }
            case TokenizeState.Ident: {
                if (char === "\\") {
                    this._stack.push(TokenizeState.Escape);
                    this._current += char;
                } else if (char !== undefined && /[\da-z]/i.test(char)) {
                    this._current += char;
                } else {
                    const isKeyword = keywords.includes(
                        this._current as Keyword,
                    );
                    this._nextToken(isKeyword ? "Keyword" : "Ident", char);
                }
                break;
            }
            case TokenizeState.Number: {
                if (char !== undefined && /[\d_]/.test(char)) {
                    this._current += char;
                } else {
                    this._nextToken("Number", char);
                }
                break;
            }
            case TokenizeState.String: {
                if (char === undefined) {
                    throw new SyntaxError("Unexpected end of input.");
                }
                this._current += char;
                switch (char) {
                    case "\\": {
                        this._stack.push(TokenizeState.Escape);
                        break;
                    }
                    case "$": {
                        this._pushToken("String");
                        this._stack.push(TokenizeState.Ident);
                        break;
                    }
                    case '"': {
                        this._stack.pop();
                        this._pushToken("String");
                        break;
                    }
                }
                break;
            }
            case TokenizeState.Whitespace: {
                if (char !== undefined && isWhitespace(char)) {
                    this._current += char;
                } else {
                    this._nextToken("Whitespace", char);
                }
                break;
            }
            default:
                assert.unreachable<typeof state>();
        }
    }
    tokenize(): Token[] {
        for (const char of this.source) {
            this.next(char);
        }

        if (this._stack.length > 0) {
            // eslint-disable-next-line unicorn/no-useless-undefined
            this.next(undefined);
        }

        return this.tokens;
    }
}
