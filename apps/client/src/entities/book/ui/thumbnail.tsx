import { resolveResource } from "../model";

const COLOR_THUMBNAIL_PREFIX = "color:";
const SIZE_SCALE = 4;

export const BookThumbnail: React.FC<{
  thumbnail: string;
  size?: number;
  className?: string;
}> = ({ thumbnail, size = 24, className }) => {
  size *= SIZE_SCALE;

  if (thumbnail.startsWith(COLOR_THUMBNAIL_PREFIX)) {
    return (
      <svg width={size} height={size} viewBox="0 0 1 1" className={className}>
        <rect
          width="1"
          height="1"
          fill={thumbnail.slice(COLOR_THUMBNAIL_PREFIX.length)}
        />
      </svg>
    );
  }

  return (
    <img
      src={resolveResource(thumbnail).href}
      alt="book thumbnail"
      width={size}
      height={size}
      className={className}
    />
  );
};
