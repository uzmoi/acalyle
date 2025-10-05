import { sortBy } from "es-toolkit";
import { type BookId, useBookDetail } from "~/entities/book";
import type { TagMetadata } from "~/entities/tag";

export const useFilteredTags = (
  bookId: BookId,
  query: string,
): TagMetadata[] => {
  const bookDetail = useBookDetail(bookId);

  if (bookDetail == null) return [];

  const normalTags = bookDetail.tags
    .values()
    .filter(tag => tag.symbol.startsWith("#"));

  const filteredTags = normalTags.filter(
    ({ symbol, description }) =>
      symbol.includes(query) || description.includes(query),
  );

  return sortBy(filteredTags.toArray(), ["symbol"]);
};
