export type IdentExpression = {
    type: "Ident";
    name: string;
};

export type BoolExpression = {
    type: "Bool";
    value: boolean;
};

export type NumberExpression = {
    type: "Number";
    value: string;
};

export type StringExpression = {
    type: "String";
    strings: string[];
    values: Expression[];
};

export type TupleExpression = {
    type: "Tuple";
    elements: Expression[];
    properties: [IdentExpression, Expression][];
};

export type BlockExpression = {
    type: "Block";
    stmts: Statement[];
    last: Expression | null;
};

export type IfExpression = {
    type: "If";
    cond: Expression;
    thenBody: Expression;
    elseBody: Expression | null;
};

export type FnExpression = {
    type: "Fn";
    params: IdentExpression[];
    body: Expression;
};

export type ReturnExpression = {
    type: "Return";
    body: Expression | null;
};

export type Expression =
    | IdentExpression
    | BoolExpression
    | NumberExpression
    | StringExpression
    | TupleExpression
    | BlockExpression
    | IfExpression
    | FnExpression
    | ReturnExpression;

export type ExpressionStatement = {
    type: "Expression";
    expr: Expression;
};

export type Statement = ExpressionStatement;
