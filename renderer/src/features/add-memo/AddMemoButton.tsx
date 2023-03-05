import { Button, ControlGroup, Modal } from "@acalyle/ui";
import { css } from "@linaria/core";
import { useEffect, useState } from "react";
import { WindowEvent } from "~/shared/global-event/window-event";
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

    const [isOpenTemplatePopup, setIsOpenTemplatePopup] = useState(false);

    useEffect(() => {
        return WindowEvent.on("click", () => {
            setIsOpenTemplatePopup(false);
        });
    }, []);

    return (
        <div
            className={css`
                position: relative;
            `}
        >
            <ControlGroup>
                <Button onClick={() => addMemo()} disabled={isInFlight}>
                    Add memo
                </Button>
                <Button
                    onClick={e => {
                        e.stopPropagation();
                        setIsOpenTemplatePopup(isOpen => !isOpen);
                    }}
                >
                    <span
                        // HACK アイコンライブラリ入れよう
                        className={css`
                            font-size: 0.5em;
                            line-height: 0;
                        `}
                    >
                        ▼
                    </span>
                </Button>
            </ControlGroup>
            <Modal
                open={isOpenTemplatePopup}
                onClose={() => setIsOpenTemplatePopup(false)}
                variant="popup"
                className={css`
                    top: calc(100% + 0.5em);
                    right: 0;
                    overflow: hidden;
                    white-space: nowrap;
                    background-color: #222;
                    border-radius: 0.25em;
                    box-shadow: 0 0 2em #111;
                `}
            >
                <AddTemplateMemoButtonList data={data} onMemoAdd={addMemo} />
            </Modal>
        </div>
    );
};
