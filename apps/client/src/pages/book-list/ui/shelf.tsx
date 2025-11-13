import { cx, style } from "@acalyle/css";
import { use } from "react";
import type { Book } from "~/entities/book";
import { BookCover } from "./cover";

export const BookShelf: React.FC<{
  fetchingBooks: Promise<readonly Book[]>;
}> = ({ fetchingBooks }) => {
  const books = use(fetchingBooks);

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
