import { useState } from "react";
import { graphql, useMutation } from "react-relay";
import { Button, TextArea } from "~/shared/control";
import { memoContentsUpdateMutation } from "./__generated__/memoContentsUpdateMutation.graphql";

export const MemoContentsForm: React.FC<{
    bookId: string;
    memoId: string;
    contents: string;
    onClose: () => void;
}> = ({ bookId, memoId, contents: memoContents, onClose }) => {
    const [contents, setContents] = useState(memoContents);

    const [commit, isInFlight] = useMutation<memoContentsUpdateMutation>(graphql`
        mutation memoContentsUpdateMutation($bookId: ID!, $memoId: ID!, $contents: String!) {
            updateMemoContents(bookId: $bookId, memoId: $memoId, contents: $contents) {
                node {
                    contents
                    updatedAt
                }
            }
        }
    `);
    const handleSubmit = () => {
        commit({
            variables: { bookId, memoId, contents },
            onCompleted: onClose,
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <TextArea value={contents} onValueChange={setContents} disabled={isInFlight} />
            <Button onClick={onClose} disabled={isInFlight}>cancel</Button>
            <Button disabled={isInFlight}>save</Button>
        </form>
    );
};