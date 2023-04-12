import { identify, noop } from "emnorst";
import { setImmediate } from "node:timers/promises";
import { describe, expect, test, vi } from "vitest";
import { type GqlConnection, createConnectionAtom } from "./connection";

describe("createConnectionAtom", () => {
    const emptyConnection = {
        pageInfo: { hasNextPage: false },
    } satisfies GqlConnection<{ id: string }>;
    test("initial state", () => {
        const load = vi.fn().mockResolvedValue(emptyConnection);
        const nodeStore = vi.fn();
        const connection = createConnectionAtom(nodeStore, load, identify);
        expect(connection.get()).toEqual(
            expect.objectContaining({
                endCursor: null,
                hasNext: true,
                isLoading: true,
                nodes: [],
            }),
        );
    });
    test("mount", async () => {
        const load = vi.fn().mockResolvedValue(emptyConnection);
        const nodeStore = vi.fn();
        const connection = createConnectionAtom(nodeStore, load, identify);
        connection.subscribe(noop);
        await setImmediate();
        expect(connection.get()).toEqual(
            expect.objectContaining({
                endCursor: null,
                hasNext: false,
                isLoading: false,
                nodes: [],
            }),
        );
    });
});
