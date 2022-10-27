export interface HeightWith<T> {
    node: T;
    height: number;
}

export interface Column<T> {
    height: number;
    nodes: HeightWith<T>[];
}

export const columnSplit = <T>(
    nodes: readonly HeightWith<T>[],
    columnsCount: number,
): HeightWith<T>[][] => {
    const columns: readonly Column<T>[] = Array.from(
        { length: columnsCount },
        () => ({ height: 0, nodes: [] }),
    );
    for(const node of nodes) {
        const minColumn = columns.reduce((minColumn, column) =>
            column.height < minColumn.height ? column : minColumn
        );
        minColumn.height += node.height;
        minColumn.nodes.push(node);
    }
    return columns.map(column => column.nodes);
};

if(import.meta.vitest) {
    const { it, expect } = import.meta.vitest;
    it("返り値の配列.length === columnsCount", () => {
        expect(columnSplit([], 2).length).toBe(2);
    });
    it("heightが小さい所を埋めるように入る", () => {
        const nodes = [
            { node: 1, height: 1 },
            { node: 2, height: 3 },
            { node: 3, height: 1 },
            { node: 4, height: 2 },
            { node: 5, height: 1 },
            { node: 6, height: 1 },
        ];
        expect(columnSplit(nodes, 2)).toEqual([
            [
                { node: 1, height: 1 },
                { node: 3, height: 1 },
                { node: 4, height: 2 },
                { node: 6, height: 1 },
            ],
            [
                { node: 2, height: 3 },
                { node: 5, height: 1 },
            ],
        ]);
    });
}
