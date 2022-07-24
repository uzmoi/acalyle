import { css } from "@linaria/core";
import { clamp } from "emnorst";
import { graphql, useFragment } from "react-relay";
import { MemoFragment$key } from "./__generated__/MemoFragment.graphql";

export const contentsHeight = (contents: readonly string[]) => {
    const contentsLines = contents.reduce<number>(
        (accum, content) => accum + content.split("\n").length,
        0,
    );
    return clamp(Math.floor(contentsLines / 8), 1, 4);
};

export const MemoStyle = css`
    width: 16em;
    height: calc(var(--height) * 8em);
    padding: 0.4em;
`;

export const Memo: React.FC<{
    fragmentRef: MemoFragment$key;
}> = ({ fragmentRef }) => {
    const memo = useFragment<MemoFragment$key>(graphql`
        fragment MemoFragment on Memo {
            id
            createdAt
            updatedAt
            contents
        }
    `, fragmentRef);

    const tile = contentsHeight(memo.contents);

    return (
        <article id={memo.id} className={MemoStyle} style={{ "--height": tile }}>
            {memo.contents.map(content => (
                <div key={content}>
                    {content}
                </div>
            ))}
        </article>
    );
};
