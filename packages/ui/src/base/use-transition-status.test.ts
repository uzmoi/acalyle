import { act, renderHook } from "@testing-library/react";
import { timeout } from "emnorst";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import {
    type UseTransitionStatusOptions,
    useTransitionStatus,
} from "./use-transition-status";

const transition = () => timeout(1000);

describe("useTransitionStatus", () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });
    afterEach(() => {
        vi.useRealTimers();
    });
    describe("初期値", () => {
        test("show: false, appear: true", () => {
            const { result } = renderHook(useTransitionStatus, {
                initialProps: { show: false, appear: true, transition },
            });
            expect(result.current).toBe("exited");
        });
        test("show: false, appear: false", () => {
            const { result } = renderHook(useTransitionStatus, {
                initialProps: { show: false, appear: false, transition },
            });
            expect(result.current).toBe("exited");
        });
        test("show: true, appear: true", async () => {
            const { result } = renderHook(useTransitionStatus, {
                initialProps: { show: true, appear: true, transition },
            });
            expect(result.current).toBe("entering");

            await act(() => vi.runAllTimersAsync());
            expect(result.current).toBe("entered");
        });
        test("show: true, appear: false", () => {
            const { result } = renderHook(useTransitionStatus, {
                initialProps: { show: true, appear: false, transition },
            });
            expect(result.current).toBe("entered");
        });
    });
    describe("enter", () => {
        test('`enter: false`なら"entering"を挟まずに"entered"に移行', () => {
            const { result, rerender } = renderHook(useTransitionStatus, {
                initialProps: { transition } as UseTransitionStatusOptions,
            });
            rerender({ enter: false, show: true, transition });
            expect(result.current).toBe("entered");
        });
        test("-> entering -> entered", async () => {
            const { result, rerender } = renderHook(useTransitionStatus, {
                initialProps: { transition } as UseTransitionStatusOptions,
            });
            rerender({ show: true, transition });
            expect(result.current).toBe("entering");

            await act(() => vi.runAllTimersAsync());
            expect(result.current).toBe("entered");
        });
        test("中断", () => {
            const { result, rerender } = renderHook(useTransitionStatus, {
                initialProps: { transition } as UseTransitionStatusOptions,
            });
            rerender({ show: true, transition });
            rerender({ show: false, transition });
            expect(result.current).toBe("exited");
        });
    });
    describe("exit", () => {
        test('`exit: false`なら"exiting"を挟まずに"exited"に移行', () => {
            const { result, rerender } = renderHook(useTransitionStatus, {
                initialProps: {
                    appear: false,
                    show: true,
                    transition,
                } as UseTransitionStatusOptions,
            });
            rerender({ exit: false, show: false, transition });
            expect(result.current).toBe("exited");
        });
        test("-> exiting -> exited", async () => {
            const { result, rerender } = renderHook(useTransitionStatus, {
                initialProps: {
                    appear: false,
                    show: true,
                    transition,
                } as UseTransitionStatusOptions,
            });
            rerender({ show: false, transition });
            expect(result.current).toBe("exiting");

            await act(() => vi.runAllTimersAsync());
            expect(result.current).toBe("exited");
        });
        test("中断", () => {
            const { result, rerender } = renderHook(useTransitionStatus, {
                initialProps: {
                    appear: false,
                    show: true,
                    transition,
                } as UseTransitionStatusOptions,
            });
            rerender({ show: false, transition });
            rerender({ show: true, transition });
            expect(result.current).toBe("entered");
        });
    });
});
