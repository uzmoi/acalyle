import { cx, style } from "@acalyle/css";
import { theme } from "~/theme";
import { resolveResource } from "../model";

export const BookThumbnail: React.FC<{
  src: string;
  className?: string;
}> = ({ src, className }) => {
  const divClassName = cx(
    ":uno: size-24 overflow-hidden",
    style({ borderRadius: theme("bookOverview-round") }),
    className,
  );

  const prefix = "color:";
  if (src.startsWith(prefix)) {
    const color = src.slice(prefix.length);
    return <div className={divClassName} style={{ backgroundColor: color }} />;
  }

  return (
    <div className={divClassName}>
      <img
        src={resolveResource(src).href}
        alt="book thumbnail"
        width={96}
        height={96}
      />
    </div>
  );
};
