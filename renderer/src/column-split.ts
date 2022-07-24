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
