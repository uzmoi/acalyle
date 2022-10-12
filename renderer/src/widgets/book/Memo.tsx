import { css } from "@linaria/core";
import { useState } from "react";
import { graphql, useFragment, useMutation } from "react-relay";
import { MemoEditMemoContentsMutation } from "./__generated__/MemoEditMemoContentsMutation.graphql";
import { MemoFragment$key } from "./__generated__/MemoFragment.graphql";

export const Memo: React.FC<{
    bookId: string;
    fragmentRef: MemoFragment$key;
}> = ({ bookId, fragmentRef }) => {
    const memo = useFragment<MemoFragment$key>(graphql`
        fragment MemoFragment on Memo {
            id
            contents
            createdAt
            updatedAt
        }
    `, fragmentRef);

    const [commitEditMemo, isInFlight] = useMutation<MemoEditMemoContentsMutation>(graphql`
        mutation MemoEditMemoContentsMutation($bookId: ID!, $memoId: ID!, $contents: String!) {
            editMemo(bookId: $bookId, memoId: $memoId, contents: $contents) {
                node {
                    contents
                    updatedAt
                }
            }
        }
    `);

    const [contents, setContents] = useState<null | string>(null);

    return (
        <div className={MemoStyle}>
            {contents != null ? (
                <div className={MemoContentsStyle}>
                    <textarea
                        value={contents}
                        onChange={e => setContents(e.target.value)}
                        disabled={isInFlight}
                    />
                    <button onClick={() => setContents(null)}>
                        cancel
                    </button>
                    <button
                        onClick={() => {
                            commitEditMemo({
                                variables: { bookId, memoId: memo.id, contents },
                                onCompleted() {
                                    setContents(null);
                                },
                            });
                        }}
                    >
                        save
                    </button>
                </div>
            ) : (
                <div className={MemoContentsStyle}>
                    {memo.contents.map(contentBlock => (
                        <div key={contentBlock} className={MemoContentBlockStyle}>
                            {contentBlock}
                        </div>
                    ))}
                    <button onClick={() => setContents(memo.contents.join())}>
                        edit
                    </button>
                </div>
            )}
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
