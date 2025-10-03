import { type BookId, useBookDetail } from "~/entities/book";
import type { TagSymbol } from "~/entities/tag";

const TEMPLATE_TAG_SYMBOL = "*template" as TagSymbol;

export const useTemplates = (bookId: BookId): readonly string[] => {
  const bookDetail = useBookDetail(bookId)!;

  const templateTagMetadata = bookDetail.tags.get(TEMPLATE_TAG_SYMBOL);
  const templates = templateTagMetadata?.props ?? new Set();

  return [...templates];
};
