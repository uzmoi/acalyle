import { memoize } from "es-toolkit";
import { use } from "react";
import { type BookId, fetchBookDetail } from "~/entities/book";
import type { TagSymbol } from "~/entities/tag";

const memoizedFetchBookDetail = /* #__PURE__ */ memoize(fetchBookDetail);

const TEMPLATE_TAG_SYMBOL = "@template" as TagSymbol;

export const useTemplates = (bookId: BookId): readonly string[] => {
  const bookDetail = use(memoizedFetchBookDetail(bookId)).unwrap()!;

  const templateTagMetadata = bookDetail.tags.get(TEMPLATE_TAG_SYMBOL);
  const templates = templateTagMetadata?.props ?? new Set();

  return [...templates];
};
