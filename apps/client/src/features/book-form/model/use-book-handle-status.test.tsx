import { act, renderHook } from "@testing-library/react";
import { Err, Ok } from "@uzmoi/ut/fp";
import { describe, expect, test, vi } from "vitest";
import { type Book, fetchBookByHandle } from "~/entities/book";
import { useBookHandleStatus } from "./use-book-handle-status";

vi.mock("~/entities/book");

describe("useBookHandleStatus", () => {
  test("no-change", async () => {
    const { result } = renderHook(useBookHandleStatus);

    expect(result.current[1]).toBe("no-change");
  });

  test("invalid", async () => {
    const { result } = renderHook(useBookHandleStatus, {});

    await act(async () => {
      result.current[2]("+");
    });

    expect(result.current[1]).toBe("invalid");
  });

  test("unavailable", async () => {
    vi.mocked(fetchBookByHandle).mockResolvedValue(Ok({} as Book));

    const { result } = renderHook(useBookHandleStatus);

    await act(async () => {
      result.current[2]("hoge");
    });

    expect(result.current[1]).toBe("unavailable");
  });

  test("available", async () => {
    vi.mocked(fetchBookByHandle).mockResolvedValue(Ok(null));

    const { result } = renderHook(useBookHandleStatus);

    await act(async () => {
      result.current[2]("hoge");
    });

    expect(result.current[1]).toBe("available");
  });

  test("unknown", async () => {
    vi.mocked(fetchBookByHandle).mockResolvedValue(
      Err({ name: "NotFoundError" }),
    );

    const { result } = renderHook(useBookHandleStatus);

    await act(async () => {
      result.current[2]("hoge");
    });

    expect(result.current[1]).toBe("unknown");
  });
});
