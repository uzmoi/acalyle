import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { Ok } from "@uzmoi/ut/fp";
import { describe, expect, test, vi } from "vitest";
import { type BookId, type Book, fetchBookByHandle } from "~/entities/book";
import { confirm } from "~/features/modal";
import { changeBookHandle } from "../model";
import { BookHandleForm } from "./book-handle-form";

vi.mock("~/entities/book");

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
    vi.mocked(fetchBookByHandle).mockResolvedValue(Ok({} as Book));

    render(<BookHandleForm bookId={bookId} currentHandle={null} />);

    await userEvent.type(screen.getByRole("textbox"), "hoge");

    const el = screen.getByTestId("handle_status_message");
    expect(el.dataset.ok).toBe("false");
  });

  test("available", async () => {
    const bookId = "<book-id>" as BookId;
    vi.mocked(fetchBookByHandle).mockResolvedValue(Ok(null));

    render(<BookHandleForm bookId={bookId} currentHandle={null} />);

    await userEvent.type(screen.getByRole("textbox"), "hoge");

    const el = screen.getByTestId("handle_status_message");
    expect(el.dataset.ok).toBe("true");
  });
});

vi.mock("~/features/modal");
vi.mock("../model", { spy: true });

test("submit", async () => {
  const bookId = "<book-id>" as BookId;
  vi.mocked(fetchBookByHandle).mockResolvedValue(Ok(null));
  vi.mocked(confirm).mockResolvedValue(true);
  vi.mocked(changeBookHandle).mockResolvedValue(void 0);

  render(<BookHandleForm bookId={bookId} currentHandle={null} />);

  await userEvent.type(screen.getByRole("textbox"), "hoge");
  await userEvent.click(screen.getByRole("button"));

  expect(changeBookHandle).toHaveBeenCalledWith(bookId, "hoge");
});
