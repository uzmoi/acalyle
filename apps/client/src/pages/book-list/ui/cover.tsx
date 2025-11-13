import { cx, style } from "@acalyle/css";
import { theme } from "@acalyle/ui";
import { Link } from "@tanstack/react-router";
import { type Book, bookRefOf } from "~/entities/book";
import { BookThumbnail } from "./thumbnail";

export const BookCover: React.FC<{
  book: Book;
}> = ({ book }) => {
  return (
    <div
      data-book-id={book.id}
      data-book-handle={book.handle}
      className={cx(
        ":uno: flex h-24 relative",
        style({
          background: theme("bookOverview-bg"),
          color: theme("bookOverview-text"),
          borderRadius: theme("bookOverview-round"),
        }),
      )}
    >
      <BookThumbnail thumbnail={book.thumbnail} className=":uno: flex-none" />
      <div className=":uno: flex-1 overflow-hidden px-4 py-2">
        <p
          className={cx(
            ":uno: overflow-hidden text-ellipsis ws-nowrap",
            style({
              // (height / 2 - paddingBlock) / lineHeight
              // oxlint-disable-next-line no-magic-numbers
              fontSize: `${(6 / 2 - 0.5) / 1.375}em`,
              lineHeight: 1.375,
            }),
          )}
        >
          <Link
            to="/books/$book-ref"
            params={{ "book-ref": bookRefOf(book) }}
            className=":uno: text-inherit decoration-none before:absolute before:inset-0 before:content-empty"
          >
            {book.title}
          </Link>
        </p>
        <div
          className={cx(
            ":uno: b-t b-t-solid pt-1",
            style({ borderTopColor: theme("bookOverview-border") }),
          )}
        >
          {book.handle && <p className=":uno: text-xs">{book.handle}</p>}
          <p className=":uno: overflow-hidden text-ellipsis ws-nowrap text-sm">
            {book.description}
          </p>
        </div>
      </div>
    </div>
  );
};
