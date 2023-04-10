import { Button, Modal } from "@acalyle/ui";
import { style } from "@macaron-css/core";
import { useState } from "react";
import { BiPlus } from "react-icons/bi";
import { AddTagForm } from "./AddTagForm";

export const AddTagButton: React.FC<{
    bookHandle: string;
    memoId: string;
}> = ({ bookHandle, memoId }) => {
    const [isOpenAddTagPopup, setIsOpenAddTagPopup] = useState(false);

    return (
        <div
            className={style({
                position: "relative",
                display: "inline-block",
            })}
        >
            <Button
                variant="unstyled"
                onClick={e => {
                    e.stopPropagation();
                    setIsOpenAddTagPopup(isOpen => !isOpen);
                }}
            >
                <BiPlus className={style({ verticalAlign: "middle" })} />
            </Button>
            <Modal
                open={isOpenAddTagPopup}
                onClose={() => setIsOpenAddTagPopup(false)}
                variant="popup"
                className={style({
                    top: "calc(100% + 0.5em)",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    backgroundColor: "#222",
                    borderRadius: "0.25em",
                    boxShadow: "0 0 2em #111",
                })}
            >
                <AddTagForm
                    bookHandle={bookHandle}
                    memoId={memoId}
                    onCompleted={() => setIsOpenAddTagPopup(false)}
                />
            </Modal>
        </div>
    );
};
