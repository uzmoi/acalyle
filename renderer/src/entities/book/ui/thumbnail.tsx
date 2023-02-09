import { css, cx } from "@linaria/core";

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
                src={src}
                alt="book thumbnail"
                className={css`
                    width: 100%;
                `}
            />
        </div>
    );
};

const ThumbnailStyle = css`
    width: 6em;
    height: 6em;
`;
