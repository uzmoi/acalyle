import { cx, style } from "@acalyle/css";
import { acalyle } from "~/app/main";
import { theme } from "~/theme";

export const BookThumbnail: React.FC<{
  src: string;
  className?: string;
}> = ({ src, className }) => {
  const divClassName = cx(
    ":uno: w-24 h-24 overflow-hidden",
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
        src={acalyle.net.resolveResource(src).href}
        alt="book thumbnail"
        className=":uno: w-full"
      />
    </div>
  );
};
