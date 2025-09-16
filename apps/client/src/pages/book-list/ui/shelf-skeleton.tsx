import { cx, style } from "@acalyle/css";
import { theme } from "@acalyle/ui";

export const BookShelfSkeleton: React.FC = () => (
  <div
    className={cx(
      ":uno: grid gap-x-5 gap-y-3",
      style({ gridTemplateColumns: "repeat(auto-fit, minmax(32em, 1fr))" }),
    )}
  >
    {/* TODO: 要素数を定数化 or 変数化したい */}
    {/* ref. api/index.ts */}
    {Array.from({ length: 32 }).map((_, i) => (
      <div
        key={i}
        className={cx(
          ":uno: flex h-24 animate-pulse",
          style({
            background: theme("bookOverview-bg"),
            borderRadius: theme("bookOverview-round"),
          }),
        )}
      />
    ))}
  </div>
);
