import { css } from "@linaria/core";
import { TagList } from "~/entities/tag";
import { vars } from "~/entities/theme";
import { Link } from "~/features/location";
import { link } from "~/pages/link";

export const MemoOverview: React.FC<{
    bookId: string;
    memo: {
        id: string;
        contents: string;
        tags: readonly string[];
    };
}> = ({ bookId, memo }) => {
    return (
        <article id={memo.id} className={MemoOverviewStyle}>
            <Link
                to={link("books/:bookId/:memoId", { bookId, memoId: memo.id })}
                className={MemoOverviewContentsLinkStyle}
            >
                {memo.contents}
            </Link>
            <div className={TagListStyle}>
                <TagList tags={memo.tags} bookId={bookId} />
            </div>
        </article>
    );
};

export const MemoOverviewStyle = css`
    display: flex;
    flex-flow: column nowrap;
    padding: 0.4em;
    white-space: pre;
    background-color: ${vars.color.bg3};
`;

const MemoOverviewContentsLinkStyle = css`
    display: block;
    flex: 1;
    overflow: hidden;
    color: currentcolor;
`;

const TagListStyle = css`
    position: relative;
    flex: 0 0 1;
    overflow: hidden;
    font-size: 0.75em;
    &::before {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        display: block;
        pointer-events: none;
        content: "";
        box-shadow: inset -1em 0 0.5em -0.5em ${vars.color.bg3};
    }
`;
