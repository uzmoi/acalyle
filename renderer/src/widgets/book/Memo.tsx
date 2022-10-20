import { css } from "@linaria/core";
import { useState } from "react";
import { graphql, useFragment, useMutation } from "react-relay";
import { Button, TextArea } from "~/shared/control";
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
                    <TextArea
                        value={contents}
                        onValueChange={setContents}
                        disabled={isInFlight}
                    />
                    <Button onClick={() => setContents(null)}>
                        cancel
                    </Button>
                    <Button
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
                    </Button>
                </div>
            ) : (
                <div className={MemoContentsStyle}>
                    {memo.contents}
                    <Button onClick={() => setContents(memo.contents)}>
                        edit
                    </Button>
                </div>
            )}
            <div className={MemoFooterStyle}>
                <p>updated at {new Date(memo.updatedAt).toLocaleDateString()}</p>
                <p>created at {new Date(memo.createdAt).toLocaleDateString()}</p>
            </div>
        </div>
    );
};

const MemoStyle = css`
    padding: 1em;
`;

const MemoContentsStyle = css`
    white-space: pre;
`;

const MemoFooterStyle = css`
    font-size: 0.8em;
`;
