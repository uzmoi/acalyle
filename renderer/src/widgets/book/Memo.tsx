import { css } from "@linaria/core";
import { useState } from "react";
import { graphql, useFragment, useMutation } from "react-relay";
import { MemoContents } from "~/entities/memo";
import { Tag } from "~/entities/tag";
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
            tags
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
                <div>
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
                <div>
                    <MemoContents contents={memo.contents} />
                    <Button onClick={() => setContents(memo.contents)}>
                        edit
                    </Button>
                </div>
            )}
            <div className={MemoFooterStyle}>
                <p>updated at {new Date(memo.updatedAt).toLocaleDateString()}</p>
                <p>created at {new Date(memo.createdAt).toLocaleDateString()}</p>
                <ul>
                    {memo.tags.map(tag => (
                        <li key={tag}>
                            <Tag tag={tag} />
                        </li>
                    ))}
                </ul>
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
