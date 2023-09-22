import { cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { Modal, ModalContainer } from "./modal";

beforeEach(() => {
    vi.useFakeTimers();
});
afterEach(async () => {
    await vi.runAllTimersAsync();
    vi.restoreAllMocks();
    cleanup();
});

describe("ModalContainer", () => {
    test("confirm", async () => {
        const modal = Modal.create(false);
        const renderModal = () => (
            <div>
                <button onClick={() => void modal.close()}>Cancel</button>
                <button onClick={() => void modal.close(true)}>Ok</button>
            </div>
        );
        const { findByText } = render(
            <ModalContainer modal={modal} render={renderModal} />,
        );

        const promise = modal.open();
        fireEvent.click(await findByText("Ok"));
        expect(await promise).toBe(true);
    });
});

describe("class Modal", () => {
    describe("status", () => {
        test("initial status is exited", () => {
            const modal = Modal.create();
            expect(modal.status.get()).toBe("exited");
        });
        test("open時のstatusの遷移", async () => {
            const modal = Modal.create();
            void modal.open();
            await vi.advanceTimersByTimeAsync(0);
            expect(modal.status.get()).toBe("entering");
            await vi.advanceTimersToNextTimerAsync();
            expect(modal.status.get()).toBe("entered");
        });
        test("entering中にcloseするとexitingに移行", async () => {
            const modal = Modal.create();
            void modal.open();
            await vi.advanceTimersByTimeAsync(1);
            void modal.close();
            expect(modal.status.get()).toBe("exiting");
            await vi.advanceTimersToNextTimerAsync();
            // clearTimeoutせずにenterの中断に対応しているため、
            // statusを"entered"にするタスク（中断されているためコールバックはnoop）
            // statusをと"exited"にするタスクの2つタスクが存在する。
            expect(modal.status.get()).toBe("exiting");
            await vi.advanceTimersToNextTimerAsync();
            expect(modal.status.get()).toBe("exited");
        });
        test("close時のstatusの遷移", async () => {
            const modal = Modal.create();
            void modal.open();
            await vi.runAllTimersAsync();
            void modal.close();
            expect(modal.status.get()).toBe("exiting");
            await vi.advanceTimersToNextTimerAsync();
            expect(modal.status.get()).toBe("exited");
        });
        test("exiting中にopenするとenteringに移行", async () => {
            const modal = Modal.create<number>();
            void modal.open(1);
            await vi.runAllTimersAsync();
            void modal.close();
            await vi.advanceTimersByTimeAsync(1);
            void modal.open(2);
            await vi.advanceTimersByTimeAsync(0);

            expect(modal.data.get()?.data).toBe(2);
            expect(modal.status.get()).toBe("entering");
            await vi.advanceTimersToNextTimerAsync();
            // clearTimeoutせずにexitの中断に対応しているため、
            // statusを"exited"にするタスク（中断されているためコールバックはnoop）
            // statusをと"entered"にするタスクの2つタスクが存在する。
            expect(modal.status.get()).toBe("entering");
            await vi.advanceTimersToNextTimerAsync();
            expect(modal.status.get()).toBe("entered");
        });
    });
    test.todo("entering/entered中にopenした時の挙動");
    test("closeは1回のみ作用する", async () => {
        const modal = Modal.create();
        void modal.open();
        await vi.runAllTimersAsync();
        void modal.close();
        await vi.advanceTimersByTimeAsync(1);
        void modal.close();
        await vi.advanceTimersByTimeAsync(1);
        void modal.open();
        await vi.advanceTimersToNextTimerAsync();
        expect(modal.status.get()).toBe("entering");
        await vi.advanceTimersToNextTimerAsync();
        expect(modal.status.get()).toBe("entered");
    });
    test("default", async () => {
        const modal = Modal.create("defaultValue");
        const result = modal.open();
        void modal.close();
        expect(await result).toBe("defaultValue");
    });
});
