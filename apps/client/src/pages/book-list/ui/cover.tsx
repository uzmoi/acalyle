import { cx, style } from "@acalyle/css";
import { theme } from "@acalyle/ui";
import { type Book, BookThumbnail, bookRefOf } from "#entities/book";
import { Link } from "#shared/ui";

export const BookCover: React.FC<{
  book: Book;
}> = ({ book }) => {
  return (
    <div
      data-book-id={book.id}
      data-book-handle={book.handle}
      className={cx(
        ":uno: relative h-24 flex overflow-hidden font-sans transition-[transform,color] focus-within:scale-102.5 hover:scale-102.5",
        style({
          background: theme("book_cover-bg"),
          color: theme("book_cover-text"),
          borderRadius: theme("book_cover-round"),
        }),
      )}
    >
      <div className=":uno: flex-1 overflow-hidden px-4 py-2">
        <div>
          {book.handle && (
            <p className=":uno: truncate text-xs text-gray font-mono">
              {book.handle}
            </p>
          )}
        </div>
        <p className=":uno: truncate text-xl">
          <Link
            to="/books/$book-ref"
            params={{ "book-ref": bookRefOf(book) }}
            className=":uno: decoration-none outline-none before:absolute before:inset-0 focus-visible:text-teal before:content-empty"
          >
            {book.title}
          </Link>
        </p>
        <hr
          className={cx(
            ":uno: b-none b-t b-t-solid my-2",
            style({ borderTopColor: theme("book_cover-border") }),
          )}
        />
        <p className=":uno: truncate text-xs text-gray">{book.description}</p>
      </div>
      <BookThumbnail thumbnail={book.thumbnail} className=":uno: flex-none" />
    </div>
  );
};
