import { noop } from "emnorst";
import { describe, expect, test, vi } from "vitest";
import { BasicLogLevel, BasicLogger } from ".";

test("transportがエラー吐いても継続する", () => {
    const logger = new BasicLogger("root");
    const consoleError = vi.spyOn(console, "error").mockImplementation(noop);
    const transport = vi.fn().mockImplementationOnce(() => {
        throw new Error();
    });
    logger.attachTransport({ transport });
    logger.attachTransport({ transport });
    logger.info("log");
    expect(transport).toBeCalledTimes(2);
    expect(consoleError).toBeCalled();
    consoleError.mockRestore();
});

describe("BasicLogger", () => {
    test("log", () => {
        const logger = new BasicLogger("root");
        const transport = vi.fn();
        logger.attachTransport({ transport });
        logger.info("message");
        expect(transport).lastCalledWith({
            level: BasicLogLevel.info,
            name: "root",
            timeStamp: expect.any(Number) as number,
            message: ["message"],
            meta: undefined,
        });
    });
    test("child", () => {
        const logger = new BasicLogger("root");
        const child = logger.child("child");
        const transport = vi.fn();
        logger.attachTransport({ transport });
        child.info("message");
        expect(transport).lastCalledWith({
            level: BasicLogLevel.info,
            name: "root.child",
            timeStamp: expect.any(Number) as number,
            message: ["message"],
            meta: undefined,
        });
    });
    test("mapChild", () => {
        const logger = new BasicLogger<string>("root");
        const child = logger.mapChild<unknown>("child", JSON.stringify);
        const transport = vi.fn();
        logger.attachTransport({ transport });
        child.info("message");
        expect(transport).lastCalledWith({
            level: BasicLogLevel.info,
            name: "root.child",
            timeStamp: expect.any(Number) as number,
            message: ['"message"'],
            meta: undefined,
        });
    });
});
