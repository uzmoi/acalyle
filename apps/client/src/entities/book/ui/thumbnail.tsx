import { cx } from "@acalyle/css";
import { resolveResource } from "../model";

const COLOR_THUMBNAIL_PREFIX = "color:";

export const BookThumbnail: React.FC<{
  thumbnail: string;
  className?: string;
}> = ({ thumbnail, className }) => {
  return (
    <div className={cx(":uno: size-24 overflow-hidden", className)}>
      {thumbnail.startsWith(COLOR_THUMBNAIL_PREFIX) ?
        <svg width={96} height={96}>
          <rect
            width={96}
            height={96}
            fill={thumbnail.slice(COLOR_THUMBNAIL_PREFIX.length)}
          />
        </svg>
      : <img
          src={resolveResource(thumbnail).href}
          alt="book thumbnail"
          width={96}
          height={96}
        />
      }
    </div>
  );
};
