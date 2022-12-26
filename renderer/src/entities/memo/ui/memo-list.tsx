import { css } from "@linaria/core";
import { TagList } from "~/entities/tag";
import { vars } from "~/entities/theme";
import { Link } from "~/shared/router/react";

export const MemoList: React.FC<{
    bookId: string;
    memos: readonly {
        id: string;
        contents: string;
        tags: readonly string[];
    }[];
}> = ({ bookId, memos }) => {
    return (
        <ul className={MemoListStyle}>
            {memos.map(memo => (
                <li key={memo.id} id={memo.id} className={MemoListItemStyle}>
                    <Link
                        pattern="books/:bookId/:memoId"
                        params={{ bookId, memoId: memo.id }}
                        className={MemoContentsLinkStyle}
                    >
                        {memo.contents}
                    </Link>
                    <div className={TagListStyle}>
                        <TagList tags={memo.tags} bookId={bookId} />
                    </div>
                </li>
            ))}
        </ul>
    );
};

const MemoListStyle = css`
    /* - */
`;

const MemoListItemStyle = css`
    position: relative;
    height: 2.5em;
    overflow: hidden;
    text-justify: center;
    white-space: nowrap;
    & ~ & {
        border-top: 1px solid ${vars.color.text};
    }
`;

const MemoContentsLinkStyle = css`
    display: inline-block;
    height: 100%;
`;

const TagListStyle = css`
    position: absolute;
    right: 0;
    display: inline-block;
    max-width: 50%;
    height: 100%;
    background-color: ${vars.color.bg3};
`;
