import type { SourceLocation } from "./location";

type Loc = { loc: SourceLocation };

export type IdentExpression = {
    type: "Ident";
    name: string;
} & Loc;

export type BoolExpression = {
    type: "Bool";
    value: boolean;
} & Loc;

export type NumberExpression = {
    type: "Number";
    value: string;
} & Loc;

export type StringExpression = {
    type: "String";
    strings: string[];
    values: Expression[];
} & Loc;

export type TupleExpression = {
    type: "Tuple";
    elements: Expression[];
    properties: [IdentExpression, Expression][];
} & Loc;

export type BlockExpression = {
    type: "Block";
    stmts: Statement[];
    last: Expression | null;
} & Loc;

export type IfExpression = {
    type: "If";
    cond: Expression;
    thenBody: Expression;
    elseBody: Expression | null;
} & Loc;

export type LoopExpression = {
    type: "Loop";
    body: Expression;
} & Loc;

export type BreakExpression = {
    type: "Break";
    body: Expression | null;
} & Loc;

export type FnExpression = {
    type: "Fn";
    params: IdentExpression[];
    body: Expression;
} & Loc;

export type ReturnExpression = {
    type: "Return";
    body: Expression | null;
} & Loc;

export type ApplyExpression = {
    type: "Apply";
    callee: Expression;
    args: Expression[];
} & Loc;

export type PropertyExpression = {
    type: "Property";
    target: Expression;
    property: IdentExpression;
} & Loc;

export type OperatorExpression = {
    type: "Operator";
    op: string;
    lhs: Expression;
    rhs: Expression;
} & Loc;

export type Expression =
    | IdentExpression
    | BoolExpression
    | NumberExpression
    | StringExpression
    | TupleExpression
    | BlockExpression
    | IfExpression
    | LoopExpression
    | BreakExpression
    | FnExpression
    | ReturnExpression
    | ApplyExpression
    | PropertyExpression
    | OperatorExpression;

export type ExpressionStatement = {
    type: "Expression";
    expr: Expression;
} & Loc;

export type LetStatement = {
    type: "Let";
    dest: IdentExpression;
    init: Expression;
} & Loc;

export type Statement = ExpressionStatement | LetStatement;
