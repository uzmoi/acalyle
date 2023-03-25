import { Button, ControlGroup, Modal } from "@acalyle/ui";
import { style } from "@macaron-css/core";
import { useCallback, useState } from "react";
import { BiCaretDown } from "react-icons/bi";
import { link } from "~/pages/link";
import { Location } from "~/store/location";
import { createMemo } from "~/store/memo";
import { CreateTemplateMemoButtonList } from "./CreateTemplateMemoButtonList";

export const CreateMemoButton: React.FC<{
    bookId: string;
}> = ({ bookId }) => {
    const [isOpenTemplatePopup, setIsOpenTemplatePopup] = useState(false);

    const createMemoNoTemplate = useCallback(() => {
        void createMemo(bookId).then(memo => {
            Location.set(link(":bookId/:memoId", { bookId, memoId: memo.id }));
        });
    }, [bookId]);

    return (
        <div
            className={style({
                position: "relative",
                display: "inline-block",
            })}
        >
            <ControlGroup>
                <Button onClick={createMemoNoTemplate}>Add memo</Button>
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
                <CreateTemplateMemoButtonList bookId={bookId} />
            </Modal>
        </div>
    );
};
