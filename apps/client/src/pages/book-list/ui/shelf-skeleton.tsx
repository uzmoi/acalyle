import { cx, style } from "asarina";
import { themeVar } from "#/entities/theme";
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
          ":uno: flex h-24 animate-pulse round-2",
          style({ background: themeVar("book-cover-bg") }),
        )}
      />
    ))}
  </div>
);
