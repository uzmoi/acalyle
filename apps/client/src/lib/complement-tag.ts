export const complementTagSymbol = (
    bookTagSymbols: readonly string[],
    input: string,
): readonly string[] => {
    return bookTagSymbols.filter(bookTagSymbol =>
        bookTagSymbol.startsWith(input),
    );
};
