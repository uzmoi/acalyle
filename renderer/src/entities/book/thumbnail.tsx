import { css } from "@linaria/core";

export const Thumbnail: React.FC<{
    src: string;
}> = ({ src }) => {
    const prefix = "color:";
    if(src.startsWith(prefix)) {
        const color = src.slice(prefix.length);
        return (
            <div className={ThumbnailStyle} style={{ backgroundColor: color }} />
        );
    }

    return (
        <div className={ThumbnailStyle}>
            <img src={src} alt="book thumbnail of book" className={ThumbnailImageStyle} />
        </div>
    );
};

const ThumbnailStyle = css`
    width: 6em;
    height: 6em;
`;

const ThumbnailImageStyle = css`
    width: 100%;
`;
