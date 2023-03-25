import { style } from "@macaron-css/core";

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
        <div className={`${ThumbnailStyle} ${className ?? ""}`}>
            <img
                src={src}
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
