import { useCallback } from "react";
import { graphql, useMutation } from "react-relay";
import { Button } from "~/shared/control";
import { AddMemoButtonMutation } from "./__generated__/AddMemoButtonMutation.graphql";

export const AddMemoButton: React.FC<{
    bookId: string;
    onMemoAdded?: (memoId: string) => void;
}> = ({ bookId, onMemoAdded }) => {
    const [commit, isInFlight] = useMutation<AddMemoButtonMutation>(graphql`
        mutation AddMemoButtonMutation($bookId: ID!) {
            createMemo(bookId: $bookId) {
                id
                contents
                tags
            }
        }
    `);

    const addMemo = useCallback(() => {
        commit({
            variables: { bookId },
            onCompleted({ createMemo }) {
                onMemoAdded?.(createMemo.id);
            },
        });
    }, [bookId, commit, onMemoAdded]);

    return (
        <Button onClick={addMemo} disabled={isInFlight}>
            Add memo
        </Button>
    );
};
