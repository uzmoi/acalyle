import { Button, ControlGroup } from "@acalyle/ui";
import { Menu } from "@headlessui/react";
import { css } from "@linaria/core";
import {
    AddTemplateMemoButtonList,
    type AddTemplateMemoButtonList$key,
} from "./AddTemplateMemoButtonList";
import { useAddMemo } from "./use-add-memo";

export const AddMemoButton: React.FC<{
    bookId: string;
    onMemoAdded?: (memoId: string) => void;
    data: AddTemplateMemoButtonList$key;
}> = ({ bookId, onMemoAdded, data }) => {
    const [addMemo, isInFlight] = useAddMemo(bookId, onMemoAdded);


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
