import { memoize } from "es-toolkit";
import { use } from "react";
import { fetchBookDetail } from "../api";
import type { BookDetail, BookId } from "./types";

const memoizedFetchBookDetail = /* #__PURE__ */ memoize(fetchBookDetail);

export const useBookDetail = (bookId: BookId): BookDetail | null =>
  use(memoizedFetchBookDetail(bookId)).unwrap();
