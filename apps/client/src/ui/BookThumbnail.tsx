import { cx } from "@acalyle/ui";
import { style } from "@macaron-css/core";
import { net } from "~/store/net";

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
                src={net.get()?.get(src)}
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
