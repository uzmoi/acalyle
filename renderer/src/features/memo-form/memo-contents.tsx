import { useState } from "react";
import { graphql, useMutation } from "react-relay";
import { Button, TextArea } from "~/shared/control";
import { memoContentsUpdateMutation } from "./__generated__/memoContentsUpdateMutation.graphql";

export const MemoContentsForm: React.FC<{
    memoId: string;
    contents: string;
    onClose: () => void;
}> = ({ memoId, contents: memoContents, onClose }) => {
    const [contents, setContents] = useState(memoContents);

    // prettier-ignore
    const [commit, isInFlight] = useMutation<memoContentsUpdateMutation>(graphql`
        mutation memoContentsUpdateMutation($memoId: ID!, $contents: String!) {
            updateMemoContents(memoId: $memoId, contents: $contents) {
                node {
                    contents
                    updatedAt
                }
            }
        }
    `);
    const handleSubmit = () => {
        commit({
            variables: { memoId, contents },
            onCompleted: onClose,
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <TextArea
                value={contents}
                onValueChange={setContents}
                disabled={isInFlight}
            />
            <Button onClick={onClose} disabled={isInFlight}>
                cancel
            </Button>
            <Button type="submit" disabled={isInFlight}>
                save
            </Button>
        </form>
    );
};
