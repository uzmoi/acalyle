import { assert } from "emnorst";
import type { Stack } from "../types";
import type { SourceLocation } from "./location";

export type TokenType =
    | "Ident"
    | "Keyword"
    | "Delimiter"
    | "Punctuator"
    | "Number"
    | "String"
    | "Whitespace"
    | "Comment";

export type Token = {
    type: TokenType;
    value: string;
    loc: SourceLocation;
};

export type Keyword = (typeof keywords)[number];

const keywords = [
    "fn",
    "return",
    "true",
    "false",
    "if",
    "else",
    "loop",
    "break",
    "let",
] as const;

export type Delimiter = (typeof delimiters)[number];

const delimiters = ["(", ")", "[", "]", "{", "}", ";", ",", "."] as const;

export type PunctuatorChar = Exclude<
    (typeof punctuatorChars)[number],
    Delimiter
>;

const punctuatorChars = [
    "!",
    "#",
    "$",
    "%",
    "&",
    "*",
    "+",
    "-",
    "/",
    ":",
    "<",
    "=",
    ">",
    "?",
    "@",
    "^",
    "|",
    "~",
    ...delimiters,
] as const;

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
    Punctuator,
    Number,
    String,
    Whitespace,
    SingleLineComment,
    MultiLineComment,
    /* eslint-enable @typescript-eslint/naming-convention */
}

export class Tokenizer {
    constructor(readonly source: string) {}
    private _stack: Stack<TokenizeState> = [];
    private _current = "";
    private _index = 0;
    appendCurrent(char: string) {
        this._current += char;
        this._index += char.length;
    }
    tokens: Token[] = [];
    private _prevTokenEndIndex = this._index;
    private _pushToken(type: TokenType) {
        const loc = [
            this._prevTokenEndIndex,
            (this._prevTokenEndIndex = this._index),
        ] as const;
        this.tokens.push({ type, value: this._current, loc });
        this._current = "";
    }
    private _pushTokenAndNext(type: TokenType, char: string | undefined) {
        this._pushToken(type);
        this._stack.pop();
        if (char !== undefined) {
            this.next(char);
        }
    }
    private _commentNestLevel = 0;
    next(char: string | undefined) {
        const state = this._stack.at(-1) ?? TokenizeState.Root;
        switch (state) {
            case TokenizeState.Root: {
                if (char === undefined) return;
                switch (char) {
                    // NOTE: "/"がPunctuatorCharなのでそれより先に配置する
                    case this.source.startsWith("//", this._index) && char: {
                        this._stack.push(TokenizeState.SingleLineComment);
                        break;
                    }
                    case this.source.startsWith("/*", this._index) && char: {
                        this._stack.push(TokenizeState.MultiLineComment);
                        break;
                    }
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
                    case punctuatorChars.includes(char as PunctuatorChar) &&
                        char: {
                        this._stack.push(TokenizeState.Punctuator);
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
                        throw new SyntaxError(`Unknown character: "${char}"`);
                }
                this.appendCurrent(char);
                break;
            }
            case TokenizeState.Escape: {
                if (char === undefined) {
                    throw new SyntaxError("Unexpected end of input.");
                } else {
                    this.appendCurrent(char);
                    this._stack.pop();
                }
                break;
            }
            case TokenizeState.Ident: {
                if (char === "\\") {
                    this._stack.push(TokenizeState.Escape);
                    this.appendCurrent(char);
                } else if (char !== undefined && /[\da-z]/i.test(char)) {
                    this.appendCurrent(char);
                } else {
                    const isKeyword = keywords.includes(
                        this._current as Keyword,
                    );
                    this._pushTokenAndNext(
                        isKeyword ? "Keyword" : "Ident",
                        char,
                    );
                }
                break;
            }
            case TokenizeState.Punctuator: {
                if (delimiters.includes(this._current as Delimiter)) {
                    this._pushTokenAndNext("Delimiter", char);
                } else if (punctuatorChars.includes(char as PunctuatorChar)) {
                    this.appendCurrent(char!);
                } else {
                    this._pushTokenAndNext("Punctuator", char);
                }
                break;
            }
            case TokenizeState.Number: {
                if (char !== undefined && /[\d_]/.test(char)) {
                    this.appendCurrent(char);
                } else {
                    this._pushTokenAndNext("Number", char);
                }
                break;
            }
            case TokenizeState.String: {
                if (char === undefined) {
                    throw new SyntaxError("Unexpected end of input.");
                }
                this.appendCurrent(char);
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
                    this.appendCurrent(char);
                } else {
                    this._pushTokenAndNext("Whitespace", char);
                }
                break;
            }
            case TokenizeState.SingleLineComment: {
                if (char === undefined || char === "\n") {
                    this._pushTokenAndNext("Comment", char);
                } else {
                    this.appendCurrent(char);
                }
                break;
            }
            case TokenizeState.MultiLineComment: {
                if (char === undefined) {
                    throw new SyntaxError("Unexpected end of input.");
                }
                this.appendCurrent(char);
                if (this.source.endsWith("*/", this._index)) {
                    if (this._commentNestLevel === 0) {
                        this._stack.pop();
                        this._pushToken("Comment");
                    } else {
                        this._commentNestLevel--;
                    }
                } else if (this.source.startsWith("/*", this._index)) {
                    this._commentNestLevel++;
                }
                break;
            }
            default:
                /* c8 ignore next */
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

        /* c8 ignore next 4 */
        if (this._stack.length > 0) {
            const stack = (this._stack as []).join(", ");
            assert.unreachable(`Stack is not empty. stack: [${stack}]`);
        }

        return this.tokens;
    }
}
