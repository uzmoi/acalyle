export type IdentExpression<T> = {
    type: "Ident";
    name: string;
} & T;

export type BoolExpression<T> = {
    type: "Bool";
    value: boolean;
} & T;

export type NumberExpression<T> = {
    type: "Number";
    value: string;
} & T;

export type StringExpression<T> = {
    type: "String";
    strings: string[];
    values: Expression<T>[];
} & T;

export type TupleExpression<T> = {
    type: "Tuple";
    elements: Expression<T>[];
    properties: [IdentExpression<T>, Expression<T>][];
} & T;

export type BlockExpression<T> = {
    type: "Block";
    stmts: Statement<T>[];
    last: Expression<T> | null;
} & T;

export type IfExpression<T> = {
    type: "If";
    cond: Expression<T>;
    thenBody: Expression<T>;
    elseBody: Expression<T> | null;
} & T;

export type LoopExpression<T> = {
    type: "Loop";
    body: Expression<T>;
} & T;

export type BreakExpression<T> = {
    type: "Break";
    body: Expression<T> | null;
} & T;

export type FnExpression<T> = {
    type: "Fn";
    params: IdentExpression<T>[];
    body: Expression<T>;
} & T;

export type ReturnExpression<T> = {
    type: "Return";
    body: Expression<T> | null;
} & T;

export type ApplyExpression<T> = {
    type: "Apply";
    callee: Expression<T>;
    args: Expression<T>[];
} & T;

export type PropertyExpression<T> = {
    type: "Property";
    target: Expression<T>;
    property: IdentExpression<T>;
} & T;

export type OperatorExpression<T> = {
    type: "Operator";
    op: string;
    lhs: Expression<T>;
    rhs: Expression<T>;
} & T;

export type Expression<T> =
    | IdentExpression<T>
    | BoolExpression<T>
    | NumberExpression<T>
    | StringExpression<T>
    | TupleExpression<T>
    | BlockExpression<T>
    | IfExpression<T>
    | LoopExpression<T>
    | BreakExpression<T>
    | FnExpression<T>
    | ReturnExpression<T>
    | ApplyExpression<T>
    | PropertyExpression<T>
    | OperatorExpression<T>;

export type ExpressionStatement<T> = {
    type: "Expression";
    expr: Expression<T>;
} & T;

export type LetStatement<T> = {
    type: "Let";
    dest: IdentExpression<T>;
    init: Expression<T>;
} & T;

export type Statement<T> = ExpressionStatement<T> | LetStatement<T>;
