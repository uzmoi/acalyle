import { css } from "@linaria/core";
import { graphql, useFragment } from "react-relay";
import { MemoContents, MemoInfo } from "~/entities/memo";
import { TagList } from "~/entities/tag";
import { MemoFragment$key } from "./__generated__/MemoFragment.graphql";

export const Memo: React.FC<{
    bookId: string;
    fragmentRef: MemoFragment$key;
}> = ({ bookId, fragmentRef }) => {
    // prettier-ignore
    const memo = useFragment<MemoFragment$key>(graphql`
        fragment MemoFragment on Memo {
            contents
            tags
            createdAt
            updatedAt
        }
    `, fragmentRef);

    return (
        <div className={MemoStyle}>
            <MemoContents contents={memo.contents} />
            <div className={MemoFooterStyle}>
                <MemoInfo
                    createdAt={memo.createdAt}
                    updatedAt={memo.updatedAt}
                />
                <TagList tags={memo.tags} bookId={bookId} />
            </div>
        </div>
    );
};

const MemoStyle = css`
    padding: 1em;
`;

const MemoFooterStyle = css`
    font-size: 0.8em;
`;
