import { Button, ControlGroup, Form, TextArea } from "@acalyle/ui";
import { css } from "@linaria/core";
import { useCallback, useState } from "react";
import { graphql, useMutation } from "react-relay";
import type { MemoContentsEditorMutation } from "./__generated__/MemoContentsEditorMutation.graphql";

export const MemoContentsEditor: React.FC<{
    memoId: string;
    defaultContents: string;
    onEditEnd?: () => void;
}> = ({ memoId, defaultContents, onEditEnd }) => {
    const [commit, isInFlight] =
        useMutation<MemoContentsEditorMutation>(graphql`
            mutation MemoContentsEditorMutation(
                $memoId: ID!
                $contents: String!
            ) {
                updateMemoContents(memoId: $memoId, contents: $contents) {
                    id
                    contents
                    updatedAt
                }
            }
        `);

    const [contents, setContents] = useState(defaultContents);

    const onSubmit = useCallback(() => {
        commit({
            variables: { memoId, contents },
            onCompleted() {
                onEditEnd?.();
            },
        });
    }, [commit, memoId, contents, onEditEnd]);

    return (
        <Form onSubmit={onSubmit}>
            <TextArea value={contents} onValueChange={setContents} />
            <ControlGroup
                className={css`
                    display: flex;
                    justify-content: right;
                    margin-top: 0.5em;
                `}
            >
                <Button onClick={onEditEnd}>Cancel</Button>
                <Button type="submit" disabled={isInFlight}>
                    Save
                </Button>
            </ControlGroup>
        </Form>
    );
};
