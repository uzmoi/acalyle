import { noop } from "emnorst";
import { expect, test, vi } from "vitest";
import { BasicLogger } from ".";

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
});
