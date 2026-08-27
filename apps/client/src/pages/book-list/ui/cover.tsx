import { cx, style } from "asarina";
import { type Book, BookThumbnail, bookRefOf } from "#/entities/book";
import { themeVar } from "#/entities/theme";
import { Link } from "#/shared/ui";

export const BookCover: React.FC<{
  book: Book;
}> = ({ book }) => {
  return (
    <div
      data-book-id={book.id}
      data-book-handle={book.handle}
      className={cx(
        ":uno: relative h-24 flex overflow-hidden font-sans transition-[transform,color] focus-within:scale-102.5 hover:scale-102.5 rounded-2",
        style({
          background: themeVar("book-cover-bg"),
          color: themeVar("book-cover-text"),
        }),
      )}
    >
      <div className=":uno: flex-1 overflow-hidden px-4 py-2">
        <div>
          {book.handle && (
            <p
              className={cx(
                ":uno: truncate text-xs font-mono",
                style({ color: themeVar("ui-muted-text") }),
              )}
            >
              {book.handle}
            </p>
          )}
        </div>
        <p className=":uno: truncate text-xl">
          <Link
            to="/books/$bookRef"
            params={{ bookRef: bookRefOf(book) }}
            className=":uno: decoration-none outline-none before:absolute before:inset-0 focus-visible:text-teal before:content-empty"
          >
            {book.title}
          </Link>
        </p>
        <hr
          className={cx(
            ":uno: b-none b-t b-t-solid my-2",
            style({ borderTopColor: themeVar("ui-border") }),
          )}
        />
        <p
          className={cx(
            ":uno: truncate text-xs",
            style({ color: themeVar("ui-muted-text") }),
          )}
        >
          {book.description}
        </p>
      </div>
      <BookThumbnail thumbnail={book.thumbnail} className=":uno: flex-none" />
    </div>
  );
};
