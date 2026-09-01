import { cx, style } from "asarina";
import { tth } from "#/entities/theme";

export const BookShelfSkeleton: React.FC<{
  count: number;
}> = ({ count }) => (
  <div
    className={cx(
      ":uno: grid gap-x-5 gap-y-3",
      style({ gridTemplateColumns: "repeat(auto-fill, minmax(24rem, 1fr))" }),
    )}
  >
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className={cx(
          ":uno: flex h-24 animate-pulse rounded-2",
          style(tth.style("book-cover-bg")),
        )}
      />
    ))}
  </div>
);
