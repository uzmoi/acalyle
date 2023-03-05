import { useCallback } from "react";
import { graphql, useMutation } from "react-relay";
import type { useAddMemoMutation } from "./__generated__/useAddMemoMutation.graphql";

export const useAddMemo = (
    bookId: string,
    onMemoAdded?: (memoId: string) => void,
): readonly [addMemo: (templateName?: string) => void, isInFlight: boolean] => {
    const [commit, isInFlight] = useMutation<useAddMemoMutation>(graphql`
        mutation useAddMemoMutation($bookId: ID!, $templateName: String) {
            createMemo(bookId: $bookId, template: $templateName) {
                id
                contents
                tags
                createdAt
                updatedAt
            }
        }
    `);

    const addMemo = useCallback(
        (templateName?: string) => {
            commit({
                variables: { bookId, templateName },
                onCompleted({ createMemo }) {
                    onMemoAdded?.(createMemo.id);
                },
            });
        },
        [bookId, commit, onMemoAdded],
    );

    return [addMemo, isInFlight];
};
