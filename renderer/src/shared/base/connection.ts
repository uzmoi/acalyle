import { nonNullable } from "emnorst";

export const getNodes = <T>(
    edges: readonly ({ node: T } | null)[] | null,
): NonNullable<T>[] => {
    return edges?.map(edge => edge?.node).filter(nonNullable) ?? [];
};
