import { type BookId, useBookDetail } from "~/entities/book";
import type { TagMetadata } from "~/entities/tag";

export const useFilteredTags = (
  bookId: BookId,
  query: string,
): TagMetadata[] => {
  const bookDetail = useBookDetail(bookId);

  const tags =
    bookDetail?.tags
      .values()
      .filter(tag => tag.symbol.startsWith("#"))
      .toArray() ?? [];

  return tags.filter(
    ({ symbol, description }) =>
      symbol.includes(query) || description.includes(query),
  );
};
