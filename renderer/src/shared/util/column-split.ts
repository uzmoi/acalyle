export const columnSplit = <T>(
    nodes: T[],
    columnsCount: number,
    contentsHeight: (node: T) => number,
) => {
    interface Column {
        height: number;
        nodes: T[];
    }
    const columns: Column[] = Array.from(
        { length: columnsCount },
        () => ({ height: 0, nodes: [] }),
    );
    for(const node of nodes) {
        const minColumn = columns.reduce((minColumn, column) =>
            column.height < minColumn.height ? column : minColumn
        );
        minColumn.height += contentsHeight(node);
        minColumn.nodes.push(node);
    }
    return columns.map(column => column.nodes);
};

if(import.meta.vitest) {
    const { it, expect } = import.meta.vitest;
    it("返り値の配列.length === columnsCount", () => {
        expect(columnSplit([], 2, () => 0).length).toBe(2);
    });
    it("heightが小さい所を埋めるように入る", () => {
        const nodes = [
            { id: 1, height: 1 },
            { id: 2, height: 3 },
            { id: 3, height: 1 },
            { id: 4, height: 2 },
            { id: 5, height: 1 },
            { id: 6, height: 1 },
        ];
        expect(columnSplit(nodes, 2, node => node.height)).toEqual([
            [
                { id: 1, height: 1 },
                { id: 3, height: 1 },
                { id: 4, height: 2 },
                { id: 6, height: 1 },
            ],
            [
                { id: 2, height: 3 },
                { id: 5, height: 1 },
            ],
        ]);
    });
}
