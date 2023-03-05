import { Button, ControlGroup } from "@acalyle/ui";
import { Menu } from "@headlessui/react";
import { css } from "@linaria/core";
import { useCallback } from "react";
import { graphql, useMutation } from "react-relay";
import {
    AddTemplateMemoButtonList,
    type AddTemplateMemoButtonList$key,
} from "./AddTemplateMemoButtonList";
import type { AddMemoButtonMutation } from "./__generated__/AddMemoButtonMutation.graphql";

export const AddMemoButton: React.FC<{
    bookId: string;
    onMemoAdded?: (memoId: string) => void;
    data: AddTemplateMemoButtonList$key;
}> = ({ bookId, onMemoAdded, data }) => {
    const [commit, isInFlight] = useMutation<AddMemoButtonMutation>(graphql`
        mutation AddMemoButtonMutation($bookId: ID!, $templateName: String) {
            createMemo(bookId: $bookId, template: $templateName) {
                id
                contents
                tags
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

    return (
        <Menu>
            <ControlGroup>
                <Button onClick={() => addMemo()} disabled={isInFlight}>
                    Add memo
                </Button>
                <Menu.Button as={Button}>▼</Menu.Button>
            </ControlGroup>
            <Menu.Items
                className={css`
                    position: relative;
                `}
            >
                <div
                    className={css`
                        position: absolute;
                        z-index: 100;
                        white-space: nowrap;
                        background-color: black;
                    `}
                >
                    <AddTemplateMemoButtonList
                        data={data}
                        onMemoAdd={addMemo}
                    />
                </div>
            </Menu.Items>
        </Menu>
    );
};
