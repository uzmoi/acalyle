import type { JsonValue, ValueOf } from "emnorst";

export const createEscapeTag =
    <T>(escape: (value: T) => string) =>
    (template: TemplateStringsArray, ...values: T[]): string => {
        let result = template.raw[0];
        for (let i = 0; i < values.length; i++) {
            result += escape(values[i]);
            result += template.raw[i + 1];
        }
        return result;
    };

export type BodyData = {
    query: string;
    variables: Record<string, JsonValue>;
};

export const mapBuffers = (
    bodyData: BodyData,
    buffers: Record<string, ArrayBuffer>,
) => {
    for (const key of Object.keys(buffers)) {
        const path = key.split(".");
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const lastKey = path.pop()!;
        const obj = path.reduce<Record<string, JsonValue | DataView>>(
            (obj, key) => obj[key] as Record<string, JsonValue>,
            bodyData,
        );
        obj[lastKey] = new DataView(buffers[key]);
    }
};

export type ResolveUnion<T extends Record<string, () => unknown>> = {
    [P in keyof T]: Awaited<ReturnType<T[P]>> & { __typename: P };
}[keyof T];

export const resolveUnion = async <T extends Record<string, () => unknown>>(
    resolvers: T,
): Promise<ResolveUnion<T> | null> => {
    type Entries = [keyof T, ValueOf<T>][];
    for (const [__typename, resolver] of Object.entries(resolvers) as Entries) {
        const result = await resolver();
        if (result != null) {
            return { ...result, __typename } as ResolveUnion<T>;
        }
    }
    return null;
};

export interface PaginationArgs {
    after?: string | null;
    before?: string | null;
    first?: number | null;
    last?: number | null;
}

export const pagination = (args: PaginationArgs) => {
    let cursor: string | null | undefined;
    let take: number | undefined;
    if (args.first != null) {
        // forward pagination
        cursor = args.after;
        take = args.first + 1;
    } else if (args.last != null) {
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
