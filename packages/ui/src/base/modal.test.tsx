import { cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { ModalContainer, openModal } from "./modal";

beforeEach(() => {
    vi.useFakeTimers();
});
afterEach(async () => {
    await vi.runAllTimersAsync();
    vi.restoreAllMocks();
    cleanup();
});

describe("openModal", () => {
    describe("status", () => {
        test("initial status is exited", () => {
            const { container } = render(<ModalContainer />);
            const rootEl = container.firstChild as HTMLElement;

            expect(rootEl.dataset.status).toBe("exited");
        });
        test("open時のstatusの遷移", async () => {
            const { container, queryByRole } = render(<ModalContainer />);
            const rootEl = container.firstChild as HTMLElement;

            void openModal<unknown>({
                default: null,
                render: close => <button onClick={close} />,
            });
            await vi.advanceTimersByTimeAsync(0);
            expect(rootEl.dataset.status).toBe("entering");
            await vi.advanceTimersToNextTimerAsync();
            expect(rootEl.dataset.status).toBe("entered");

            const button = queryByRole("button");
            if (button != null) {
                fireEvent.click(button);
            }
        });
        test("entering中にcloseするとexitingに移行", async () => {
            const { container, queryByRole } = render(<ModalContainer />);
            const rootEl = container.firstChild as HTMLElement;

            void openModal<unknown>({
                default: null,
                render: close => <button onClick={close} />,
            });
            await vi.advanceTimersByTimeAsync(1);

            const button = queryByRole("button");
            if (button != null) {
                fireEvent.click(button);
            }

            expect(rootEl.dataset.status).toBe("exiting");
            await vi.advanceTimersToNextTimerAsync();
            expect(rootEl.dataset.status).toBe("exited");
        });
        test("close時のstatusの遷移", async () => {
            const { container, queryByRole } = render(<ModalContainer />);
            const rootEl = container.firstChild as HTMLElement;

            void openModal<unknown>({
                default: null,
                render: close => <button onClick={close} />,
            });
            await vi.runAllTimersAsync();

            const button = queryByRole("button");
            if (button != null) {
                fireEvent.click(button);
            }

            expect(rootEl.dataset.status).toBe("exiting");
            await vi.advanceTimersToNextTimerAsync();
            expect(rootEl.dataset.status).toBe("exited");
        });
        test("exiting中にopenするとenteringに移行", async () => {
            const { container, queryByRole } = render(<ModalContainer />);
            const rootEl = container.firstChild as HTMLElement;

            void openModal<unknown>({
                default: null,
                render: close => <button id="1" onClick={close} />,
            });
            await vi.runAllTimersAsync();

            const button1 = queryByRole("button");
            if (button1 != null) {
                fireEvent.click(button1);
            }
            await vi.advanceTimersByTimeAsync(1);

            void openModal<unknown>({
                default: null,
                render: close => <button id="2" onClick={close} />,
            });
            await vi.advanceTimersByTimeAsync(0);

            const button2 = queryByRole("button");
            expect(button2?.id).toBe("2");
            expect(rootEl.dataset.status).toBe("entering");
            await vi.advanceTimersToNextTimerAsync();
            expect(rootEl.dataset.status).toBe("entered");

            if (button2 != null) {
                fireEvent.click(button2);
            }
        });
    });
    test.todo("entering/entered中にopenした時の挙動");
    test("closeは1回のみ作用する", async () => {
        const { container, queryByRole } = render(<ModalContainer />);
        const rootEl = container.firstChild as HTMLElement;

        const close1 = vi.fn();
        void openModal<unknown>({
            default: null,
            render: close => {
                close1.mockImplementation(close);
                return <button onClick={close} />;
            },
        });
        expect(close1.getMockImplementation()).not.toBeUndefined();
        await vi.runAllTimersAsync();

        close1();
        await vi.runAllTimersAsync();

        void openModal<unknown>({
            default: null,
            render: close => <button onClick={close} />,
        });
        await vi.runAllTimersAsync();

        close1();
        await vi.runAllTimersAsync();
        expect(rootEl.dataset.status).toBe("entered");

        const button2 = queryByRole("button");
        if (button2 != null) {
            fireEvent.click(button2);
        }
    });
    test("default", async () => {
        render(<ModalContainer />);
        const result = await openModal({
            default: "defaultValue",
            render: close => (close(), null),
        });
        expect(result).toBe("defaultValue");
    });
});
