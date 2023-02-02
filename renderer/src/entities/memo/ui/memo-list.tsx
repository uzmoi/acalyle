import { css } from "@linaria/core";
import { TagList } from "~/entities/tag";
import { vars } from "~/entities/theme";
import { Link } from "~/features/location";
import { link } from "~/pages/link";
import { List } from "~/shared/base";

export const MemoList: React.FC<{
    bookId: string;
    memos: readonly {
        id: string;
        contents: string;
        tags: readonly string[];
    }[];
}> = ({ bookId, memos }) => {
    return (
        <List className={MemoListStyle}>
            {memos.map(memo => (
                <List.Item
                    key={memo.id}
                    id={memo.id}
                    className={MemoListItemStyle}
                >
                    <Link
                        to={link("books/:bookId/:memoId", {
                            bookId,
                            memoId: memo.id,
                        })}
                        className={MemoContentsLinkStyle}
                    >
                        {memo.contents}
                    </Link>
                    <div className={TagListStyle}>
                        <TagList tags={memo.tags} bookId={bookId} />
                    </div>
                </List.Item>
            ))}
        </List>
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
