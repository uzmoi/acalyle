import { css } from "@linaria/core";
import { graphql, useFragment } from "react-relay";
import { MemoFragment$key } from "./__generated__/MemoFragment.graphql";

export const MemoStyle = css`
    width: 16em;
    height: 8em;
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

    return (
        <article id={memo.id} className={MemoStyle}>
            {memo.contents.map(content => (
                <div key={content}>
                    {content}
                </div>
            ))}
        </article>
    );
};
