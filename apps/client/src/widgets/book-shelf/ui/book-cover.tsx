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
        ":uno: relative h-24 flex rounded-2",
        style({
          background: themeVar("book-cover-bg"),
          color: themeVar("book-cover-text"),
        }),
      )}
    >
      <div
        className={cx(
          ":uno: flex-1 overflow-hidden px-4 py-2 rounded-l-2 border border-solid",
          style({ borderColor: themeVar("ui-border") }),
        )}
      >
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
            className={cx(
              ":uno: decoration-none outline-none before:absolute before:inset-0 before:content-empty before:rounded-2",
              style({
                "&::before": {
                  transition: "outline-color 150ms",
                  outline: "2px solid transparent",
                },
                "&:hover::before, &:focus-visible::before": {
                  outlineColor: "#4dd4",
                },
              }),
            )}
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
      <BookThumbnail
        thumbnail={book.thumbnail}
        className=":uno: flex-none rounded-r-2"
      />
    </div>
  );
};
