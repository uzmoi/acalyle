import { css } from "@linaria/core";
import { graphql, useFragment } from "react-relay";
import { MemoFragment$key } from "./__generated__/MemoFragment.graphql";

export const Memo: React.FC<{
    fragmentRef: MemoFragment$key;
}> = ({ fragmentRef }) => {
    const memo = useFragment<MemoFragment$key>(graphql`
        fragment MemoFragment on Memo {
            contents
            createdAt
            updatedAt
        }
    `, fragmentRef);

    return (
        <div className={MemoStyle}>
            <div className={MemoContentsStyle}>
                {memo.contents.map(contentBlock => (
                    <div key={contentBlock} className={MemoContentBlockStyle}>
                        {contentBlock}
                    </div>
                ))}
            </div>
            <p>updated at {new Date(memo.updatedAt).toLocaleDateString()}</p>
            <p>created at {new Date(memo.createdAt).toLocaleDateString()}</p>
        </div>
    );
};

const MemoStyle = css`
    /* - */
`;

const MemoContentsStyle = css`
    /* - */
`;

const MemoContentBlockStyle = css`
    /* - */
`;
