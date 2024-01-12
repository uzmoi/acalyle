export type SourceLocation = readonly [startIndex: number, endIndex: number];

export type Loc = { loc: SourceLocation };

export const loc = (start: Loc, end: Loc): SourceLocation => [
    start.loc[0],
    end.loc[1],
];
