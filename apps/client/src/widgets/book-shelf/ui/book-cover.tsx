import { cx, style } from "asarina";
import { type Book, BookThumbnail, bookRefOf } from "#/entities/book";
import { tth } from "#/entities/theme";
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
        style(tth.style("book-cover-bg", "book-cover-text")),
      )}
    >
      <div
        className={cx(
          ":uno: flex-1 overflow-hidden px-4 py-2 rounded-l-2",
          style({ border: tth("1px solid $ui-border") }),
        )}
      >
        <div>
          {book.handle && (
            <p
              className={cx(
                ":uno: truncate text-xs font-mono",
                style(tth.style("ui-muted-text")),
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
            ":uno: border-none my-2",
            style({ borderTop: tth("1px solid $ui-border") }),
          )}
        />
        <p
          className={cx(
            ":uno: truncate text-xs",
            style(tth.style("ui-muted-text")),
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
