import { Form, TextInput } from "@acalyle/ui";
import { useCallback, useState } from "react";
import { graphql, useMutation } from "react-relay";
import type { AddTagFormMutation } from "./__generated__/AddTagFormMutation.graphql";

export const AddTagForm: React.FC<{
    memoId: string;
    onCompleted?: () => void;
}> = ({ memoId, onCompleted }) => {
    const [commit, isInFlight] = useMutation<AddTagFormMutation>(graphql`
        mutation AddTagFormMutation($memoId: ID!, $tag: String!) {
            upsertMemoTags(memoIds: [$memoId], tags: [$tag]) {
                id
                tags
            }
        }
    `);

    const [tagString, setTagString] = useState("");

    const onSubmit = useCallback(() => {
        commit({
            variables: { memoId, tag: tagString },
            onCompleted() {
                onCompleted?.();
            },
        });
    }, [commit, memoId, onCompleted, tagString]);

    return (
        <Form onSubmit={onSubmit}>
            <TextInput
                disabled={isInFlight}
                value={tagString}
                onValueChange={setTagString}
            />
        </Form>
    );
};
