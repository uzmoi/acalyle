export type IdentExpression = {
    type: "Ident";
    name: string;
};

export type BoolExpression = {
    type: "Bool";
    value: boolean;
};

export type TupleExpression = {
    type: "Tuple";
    elements: Expression[];
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

export type Expression =
    | IdentExpression
    | BoolExpression
    | TupleExpression
    | IfExpression
    | FnExpression;
