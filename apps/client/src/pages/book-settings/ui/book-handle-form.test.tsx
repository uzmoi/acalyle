import { useNavigate } from "@tanstack/react-router";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { Ok } from "@uzmoi/ut/fp";
import { expect, test, vi } from "vitest";
import { type BookId, fetchBookByHandle } from "~/entities/book";
import { confirm } from "~/features/modal";
import { changeBookHandle } from "../model";
import { BookHandleForm } from "./book-handle-form";

vi.mock("@tanstack/react-router");
vi.mock("~/entities/book");
vi.mock("~/features/modal");
vi.mock("../model", { spy: true });

test("submit", async () => {
  const bookId = "<book-id>" as BookId;
  vi.mocked(fetchBookByHandle).mockResolvedValue(Ok(null));
  vi.mocked(confirm).mockResolvedValue(true);
  vi.mocked(changeBookHandle).mockResolvedValue(void 0);
  const navigate = vi.fn();
  vi.mocked(useNavigate).mockReturnValue(navigate);

  render(<BookHandleForm bookId={bookId} currentHandle={null} />);

  await userEvent.type(screen.getByRole("textbox"), "hoge");
  await userEvent.click(screen.getByRole("button"));

  expect(changeBookHandle).toHaveBeenCalledWith(bookId, "hoge");
  expect(navigate).toHaveBeenCalledWith({
    to: "/books/$book-ref/settings",
    params: { "book-ref": "hoge" },
  });
});
