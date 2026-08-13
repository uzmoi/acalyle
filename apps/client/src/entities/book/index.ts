/** @public */
export { fetchBookByHandle } from "./api";

/** @public */
export {
  type BookRef,
  bookRefFromId,
  bookRefOf,
  fetchBookByRef,
} from "./model/ref";
/** @public */
export type { Book, BookDetail, BookHandle, BookId } from "./model/types";
/** @public */
export { useBookDetail } from "./model/use-book-detail";
/** @public */
export { resolveResource } from "./model/utils";

/** @public */
export { BookThumbnail } from "./ui/thumbnail";
