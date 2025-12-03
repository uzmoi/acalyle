import { cx, style } from "@acalyle/css";
import { theme } from "@acalyle/ui";
import { BOOKS_PER_PAGE } from "../model";

export const BookShelfSkeleton: React.FC = () => (
  <div
    className={cx(
      ":uno: grid gap-x-5 gap-y-3",
      style({ gridTemplateColumns: "repeat(auto-fill, minmax(24rem, 1fr))" }),
    )}
  >
    {Array.from({ length: BOOKS_PER_PAGE }).map((_, i) => (
      <div
        key={i}
        className={cx(
          ":uno: flex h-24 animate-pulse",
          style({
            background: theme("book_cover-bg"),
            borderRadius: theme("book_cover-round"),
          }),
        )}
      />
    ))}
  </div>
);
