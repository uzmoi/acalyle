export type SourceLocation = readonly [startIndex: number, endIndex: number];

export const loc = (
    start: { loc: SourceLocation },
    end: { loc: SourceLocation },
): SourceLocation => [start.loc[0], end.loc[1]];
