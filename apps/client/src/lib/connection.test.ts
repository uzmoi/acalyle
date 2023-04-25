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
        const updateNodeStore = vi.fn();
        const connection = createConnectionAtom(load, updateNodeStore);
        expect(connection.get()).toEqual(
            expect.objectContaining({
                endCursor: null,
                hasNext: true,
                isLoading: true,
                nodeIds: [],
            }),
        );
    });
    test("mount", async () => {
        const load = vi.fn().mockResolvedValue(emptyConnection);
        const updateNodeStore = vi.fn();
        const connection = createConnectionAtom(load, updateNodeStore);
        connection.subscribe(noop);
        await setImmediate();
        expect(connection.get()).toEqual(
            expect.objectContaining({
                endCursor: null,
                hasNext: false,
                isLoading: false,
                nodeIds: [],
            }),
        );
    });
});
