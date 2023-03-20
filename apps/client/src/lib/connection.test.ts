import { noop } from "emnorst";
import { setImmediate } from "node:timers/promises";
import { describe, expect, test, vi } from "vitest";
import { type GqlConnection, createConnectionAtom } from "./connection";

describe("createConnectionAtom", () => {
    const emptyConnection = {
        pageInfo: { hasNextPage: false },
    } satisfies GqlConnection<{ id: string }>;
    test("initial state", () => {
        const load = vi.fn().mockResolvedValue(emptyConnection);
        const connection = createConnectionAtom(load);
        expect(connection.get()).toEqual({
            endCursor: null,
            hasNext: true,
            isLoading: true,
            nodes: [],
        });
    });
    test("mount", async () => {
        const load = vi.fn().mockResolvedValue(emptyConnection);
        const connection = createConnectionAtom(load);
        connection.subscribe(noop);
        await setImmediate();
        expect(connection.get()).toEqual({
            endCursor: null,
            hasNext: false,
            isLoading: false,
            nodes: [],
        });
    });
});
