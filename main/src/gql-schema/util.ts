import { interfaceType } from "nexus";

export const nonNullable = <T>(value: T): value is NonNullable<T> => value != null;

export const Node = interfaceType({
    name: "Node",
    definition(t) {
        t.id("id");
    }
});

export interface PaginationArgs {
    after?: string | null;
    before?: string | null;
    first?: number | null;
    last?: number | null;
}

export const pagination = (args: PaginationArgs) => {
    let cursor: string | null | undefined;
    let take: number | undefined;
    if(args.first != null) {
        // forward pagination
        cursor = args.after;
        take = args.first + 1;
    } else if(args.last != null) {
        // backward pagination
        cursor = args.before;
        take = -(args.last + 1);
    }
    return { cursor, take };
};

export const delimiter = "\x1f";

export const toSearchableString = (array: readonly string[]) => {
    return delimiter + array.join(delimiter) + delimiter;
};

export const parseSearchableString = (string: string) => {
    return string.split(delimiter).slice(1, -1);
};
