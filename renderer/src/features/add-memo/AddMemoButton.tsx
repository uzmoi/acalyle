import { useCallback } from "react";
import { graphql, useMutation } from "react-relay";
import { link } from "~/pages/link";
import { Button } from "~/shared/control";
import { useNavigate } from "../location";
import { AddMemoButtonMutation } from "./__generated__/AddMemoButtonMutation.graphql";

export const AddMemoButton: React.FC<{
    bookId: string;
}> = ({ bookId }) => {
    const [commit, isInFlight] = useMutation<AddMemoButtonMutation>(graphql`
        mutation AddMemoButtonMutation($bookId: ID!) {
            createMemo(bookId: $bookId) {
                id
                contents
                tags
            }
        }
    `);

    const navigate = useNavigate();

    const addMemo = useCallback(() => {
        commit({
            variables: { bookId },
            onCompleted({ createMemo }) {
                navigate(
                    link("books/:bookId/:memoId", {
                        bookId,
                        memoId: createMemo.id,
                    }),
                );
            },
        });
    }, [bookId, commit, navigate]);

    return (
        <Button onClick={addMemo} disabled={isInFlight}>
            Add memo
        </Button>
    );
};
