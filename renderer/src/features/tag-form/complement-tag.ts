export const complementTagSymbol = (
    bookTags: readonly string[],
    symbol: string,
): readonly string[] => {
    return bookTags.filter(tag => tag.startsWith(symbol));
};
