import { cx, style } from "@acalyle/css";
import { visuallyHidden } from "@acalyle/ui";
import { Link } from "@tanstack/react-router";
import { identify } from "emnorst";
import { useBook } from "~/book/ui/hook";
import type { ID } from "~/lib/graphql";
import { theme } from "~/theme";
import { type Book, type BookId, bookRefOf } from "../model";
import { BookThumbnail } from "./thumbnail";

export const BookOverview: React.FC<{
  bookId: BookId;
}> = ({ bookId }) => {
  const book = useBook(bookId as string as ID) as Book | null;

  if (book == null) {
    return null;
  }

  return (
    <div
      data-book-id={book.id}
      data-book-handle={book.handle}
      className={cx(
        ":uno: flex h-24",
        style({
          background: theme("bookOverview-bg"),
          color: theme("bookOverview-text"),
          borderRadius: theme("bookOverview-round"),
        }),
      )}
    >
      <BookThumbnail src={book.thumbnail} className=":uno: flex-none" />
      <div className=":uno: relative flex-1 overflow-hidden px-4 py-2">
        <Link
          to="/books/$book-ref"
          params={{ "book-ref": bookRefOf(book) }}
          className=":uno: absolute inset-0"
        >
          <span className={visuallyHidden}>Open book.</span>
        </Link>
        <p
          className={style({
            // (height / 2 - paddingBlock) / lineHeight
            fontSize: `${(6 / 2 - 0.5) / 1.375}em`,
            lineHeight: 1.375,
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
          })}
        >
          {book.title}
        </p>
        <div
          className={style({
            borderTop: "1px solid",
            borderTopColor: theme("bookOverview-border"),
            paddingTop: "0.25em",
          })}
        >
          {book.handle && <p className=":uno: text-xs">@{book.handle}</p>}
          <p
            className={style({
              overflow: "hidden",
              fontSize: "0.875em",
              // whiteSpace: "nowrap",
              // textOverflow: "ellipsis",
              // 複数行の三点リーダー表示
              // stylelintが先頭の文字を小文字にしてきやがるので
              // その対策でidentifyで囲っている。
              display: "-webkit-box",
              ...identify({
                WebkitLineClamp: 1,
                WebkitBoxOrient: "vertical",
              }),
              "&:first-child": {
                ...identify({
                  WebkitLineClamp: 2,
                }),
              },
            })}
          >
            {book.description}
          </p>
        </div>
      </div>
    </div>
  );
};
