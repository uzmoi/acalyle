import { cx, style } from "@acalyle/css";
import { acalyle } from "../app/main";

export const BookThumbnail: React.FC<{
    src: string;
    className?: string;
}> = ({ src, className }) => {
    const prefix = "color:";
    if (src.startsWith(prefix)) {
        const color = src.slice(prefix.length);
        return (
            <div
                className={ThumbnailStyle}
                style={{ backgroundColor: color }}
            />
        );
    }

    return (
        <div className={cx(ThumbnailStyle, className)}>
            <img
                src={acalyle.net.resolveResource(src).href}
                alt="book thumbnail"
                className={style({ width: "100%" })}
            />
        </div>
    );
};

const ThumbnailStyle = style({
    width: "6em",
    height: "6em",
});
