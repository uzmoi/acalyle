import { Button, ControlGroup, Modal } from "@acalyle/ui";
import { style } from "@macaron-css/core";
import { useEffect, useState } from "react";
import { BiCaretDown } from "react-icons/bi";
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
        <div className={style({ position: "relative" })}>
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
                    <BiCaretDown />
                </Button>
            </ControlGroup>
            <Modal
                open={isOpenTemplatePopup}
                onClose={() => setIsOpenTemplatePopup(false)}
                variant="popup"
                className={style({
                    top: "calc(100% + 0.5em)",
                    right: 0,
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    backgroundColor: "#222",
                    borderRadius: "0.25em",
                    boxShadow: "0 0 2em #111",
                })}
            >
                <AddTemplateMemoButtonList data={data} onMemoAdd={addMemo} />
            </Modal>
        </div>
    );
};
