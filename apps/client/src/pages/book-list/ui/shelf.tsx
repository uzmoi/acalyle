import { cx, style } from "@acalyle/css";
import type { Book } from "~/entities/book";
import { BookCover } from "./cover";

export const BookShelf: React.FC<{
  books: readonly Book[];
}> = ({ books }) => {
  return (
    <div
      className={cx(
        ":uno: grid gap-x-5 gap-y-3",
        style({ gridTemplateColumns: "repeat(auto-fit, minmax(24rem, 1fr))" }),
      )}
    >
      {books.map(book => (
        <BookCover key={book.id} book={book} />
      ))}
    </div>
  );
};
