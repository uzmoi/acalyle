import { Button, ControlGroup, Modal, Spinner } from "@acalyle/ui";
import { style } from "@macaron-css/core";
import { Suspense, useCallback, useState } from "react";
import { BiCaretDown } from "react-icons/bi";
import { link } from "~/pages/link";
import { useBookId } from "~/store/hook";
import { Location } from "~/store/location";
import { createMemo } from "~/store/memo";
import { CreateTemplateMemoButtonList } from "./CreateTemplateMemoButtonList";

export const CreateMemoButton: React.FC<{
    bookHandle: string;
}> = ({ bookHandle }) => {
    const [isOpenTemplatePopup, setIsOpenTemplatePopup] = useState(false);
    const bookId = useBookId(bookHandle);

    const createMemoNoTemplate = useCallback(() => {
        void createMemo(bookId).then(memo => {
            Location.set(
                link(":bookId/:memoId", {
                    bookId: bookHandle,
                    memoId: memo.id,
                }),
            );
        });
    }, [bookHandle, bookId]);

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
                    minWidth: "8em",
                    whiteSpace: "nowrap",
                    backgroundColor: "#222",
                    borderRadius: "0.25em",
                    boxShadow: "0 0 2em #111",
                })}
            >
                <Suspense
                    fallback={
                        <Spinner
                            className={style({
                                position: "relative",
                                left: "50%",
                                translate: "-50%",
                                marginBlock: "0.5em",
                                fontSize: "0.75em",
                                vars: { "--size": "1.5em" },
                            })}
                        />
                    }
                >
                    <CreateTemplateMemoButtonList bookHandle={bookHandle} />
                </Suspense>
            </Modal>
        </div>
    );
};
