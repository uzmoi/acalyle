import { css } from "@linaria/core";
import { clamp } from "emnorst";
import { graphql, useFragment } from "react-relay";
import { colors } from "~/shared/ui/styles/theme";
import { MemoOverviewFragment$key } from "./__generated__/MemoOverviewFragment.graphql";

export const contentsHeight = (contents: readonly string[]) => {
    const contentsLines = contents.reduce<number>(
        (accum, content) => accum + content.split("\n").length,
        0,
    );
    return clamp(Math.floor(contentsLines / 8), 1, 4);
};

export const MemoOverview: React.FC<{
    fragmentRef: MemoOverviewFragment$key;
}> = ({ fragmentRef }) => {
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
            {memo.contents.map(content => (
                <div key={content}>
                    {content}
                </div>
            ))}
        </article>
    );
};

export const MemoOverviewStyle = css`
    height: calc(var(--height) * 8em);
    padding: 0.4em;
    background-color: ${colors.bgSub};
`;
