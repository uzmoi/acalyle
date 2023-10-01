import { expect, test, vi } from "vitest";
import { cssole } from "./cssole";
import { createLogFunction } from "./log";

test("cssole", () => {
    const consoleLog = vi.spyOn(console, "log");
    createLogFunction(console.log)([
        cssole.style({ color: "teal" }),
        cssole.string("Hello cssole!\n"),
    ]);
    expect(consoleLog).lastCalledWith("%c%s", "color:teal", "Hello cssole!\n");
});
