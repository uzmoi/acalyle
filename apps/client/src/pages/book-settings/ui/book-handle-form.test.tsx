import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";
import type { BookId } from "~/entities/book";
import * as featuresModalModule from "~/features/modal";
import * as modelModule from "../model";
import { BookHandleForm } from "./book-handle-form";

describe("ok", () => {
  test("no-change", async () => {
    const bookId = "<book-id>" as BookId;

    render(<BookHandleForm bookId={bookId} currentHandle={null} />);

    const el = screen.getByTestId("handle_status_message");
    expect(el.dataset.ok).toBeUndefined();
  });

  test("invalid", async () => {
    const bookId = "<book-id>" as BookId;

    render(<BookHandleForm bookId={bookId} currentHandle={null} />);

    await userEvent.type(screen.getByRole("textbox"), "+");

    const el = screen.getByTestId("handle_status_message");
    expect(el.dataset.ok).toBe("false");
  });

  test("unavailable", async () => {
    const bookId = "<book-id>" as BookId;
    vi.spyOn(modelModule, "useBookHandleStatus").mockReturnValue("unavailable");

    render(<BookHandleForm bookId={bookId} currentHandle={null} />);

    await userEvent.type(screen.getByRole("textbox"), "hoge");

    const el = screen.getByTestId("handle_status_message");
    expect(el.dataset.ok).toBe("false");
  });

  test("available", async () => {
    const bookId = "<book-id>" as BookId;
    vi.spyOn(modelModule, "useBookHandleStatus").mockReturnValue("available");

    render(<BookHandleForm bookId={bookId} currentHandle={null} />);

    await userEvent.type(screen.getByRole("textbox"), "hoge");

    const el = screen.getByTestId("handle_status_message");
    expect(el.dataset.ok).toBe("true");
  });
});

test("submit", async () => {
  const bookId = "<book-id>" as BookId;
  vi.spyOn(modelModule, "useBookHandleStatus").mockReturnValue("available");
  vi.spyOn(featuresModalModule, "confirm").mockResolvedValue(true);
  const changeBookHandle = vi.spyOn(modelModule, "changeBookHandle");

  render(<BookHandleForm bookId={bookId} currentHandle={null} />);

  await userEvent.type(screen.getByRole("textbox"), "hoge");
  await userEvent.click(screen.getByRole("button"));

  expect(changeBookHandle).toHaveBeenCalledWith(bookId, "hoge");
});
