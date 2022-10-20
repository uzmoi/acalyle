import { css } from "@linaria/core";
import { clamp } from "emnorst";
import { graphql, useFragment } from "react-relay";
import { Link } from "~/shared/router/react";
import { colors } from "~/shared/ui/styles/theme";
import { MemoOverviewFragment$key } from "./__generated__/MemoOverviewFragment.graphql";

export const contentsHeight = (contents: string) => {
    const contentsLines = contents.split("\n").length;
    return clamp(Math.floor(contentsLines / 8), 1, 4);
};

export const MemoOverview: React.FC<{
    bookId: string;
    fragmentRef: MemoOverviewFragment$key;
}> = ({ bookId, fragmentRef }) => {
    const memo = useFragment<MemoOverviewFragment$key>(graphql`
        fragment MemoOverviewFragment on Memo {
            id
            createdAt
            updatedAt
            contents
        }
    `, fragmentRef);

    const tile = contentsHeight(memo.contents);

    return (
        <article id={memo.id} className={MemoOverviewStyle} style={{ "--height": tile }}>
            <Link
                pattern="books/:bookId/:memoId"
                params={{ bookId, memoId: memo.id }}
                className={MemoOverviewContentsLinkStyle}
            >
                {memo.contents}
            </Link>
        </article>
    );
};

export const MemoOverviewStyle = css`
    display: flex;
    height: calc(var(--height) * 8em);
    padding: 0.4em;
    overflow: hidden;
    white-space: pre;
    background-color: ${colors.bgSub};
`;

const MemoOverviewContentsLinkStyle = css`
    display: block;
    flex: 1 0;
    color: currentcolor;
    text-decoration: none;
`;
