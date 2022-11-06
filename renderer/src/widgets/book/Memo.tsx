import { css } from "@linaria/core";
import { useState } from "react";
import { graphql, useFragment } from "react-relay";
import { MemoContents, MemoInfo } from "~/entities/memo";
import { TagList } from "~/entities/tag";
import { MemoContentsForm, MemoTagsForm } from "~/features/memo-form";
import { Button } from "~/shared/control";
import { MemoFragment$key } from "./__generated__/MemoFragment.graphql";

export const Memo: React.FC<{
    bookId: string;
    fragmentRef: MemoFragment$key;
}> = ({ bookId, fragmentRef }) => {
    // prettier-ignore
    const memo = useFragment<MemoFragment$key>(graphql`
        fragment MemoFragment on Memo {
            id
            contents
            tags
            createdAt
            updatedAt
        }
    `, fragmentRef);

    const [isEditContents, setIsEditContents] = useState(false);
    const [isEditTag, setIsEditTag] = useState(false);

    return (
        <div className={MemoStyle}>
            {isEditContents ? (
                <div>
                    <MemoContentsForm
                        memoId={memo.id}
                        contents={memo.contents}
                        onClose={() => setIsEditContents(false)}
                    />
                </div>
            ) : (
                <div>
                    <MemoContents contents={memo.contents} />
                    <Button onClick={() => setIsEditContents(true)}>
                        edit
                    </Button>
                </div>
            )}
            <div className={MemoFooterStyle}>
                <MemoInfo
                    createdAt={memo.createdAt}
                    updatedAt={memo.updatedAt}
                />
                {isEditTag ? (
                    <MemoTagsForm
                        memoId={memo.id}
                        tags={memo.tags}
                        onClose={() => setIsEditTag(false)}
                    />
                ) : (
                    <>
                        <TagList tags={memo.tags} bookId={bookId} />
                        <Button onClick={() => setIsEditTag(true)}>
                            edit tags
                        </Button>
                    </>
                )}
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
