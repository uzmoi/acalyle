import { style } from "@acalyle/css";
import { Button, ControlGroup, Popover, Spinner } from "@acalyle/ui";
import { Suspense, useCallback } from "react";
import { BiCaretDown } from "react-icons/bi";
import { createNote } from "~/note/store/note";
import { link } from "~/pages/link";
import { useBookId } from "~/store/hook";
import { Location } from "~/store/location";
import { CreateTemplateMemoButtonList } from "./CreateTemplateMemoButtonList";

export const CreateMemoButton: React.FC<{
    bookHandle: string;
}> = ({ bookHandle }) => {
    const bookId = useBookId(bookHandle);

    const createMemoNoTemplate = useCallback(() => {
        void createNote(bookId).then(memo => {
            Location.set(
                link(":bookId/:memoId", {
                    bookId: bookHandle,
                    memoId: memo.id,
                }),
            );
        });
    }, [bookHandle, bookId]);

    return (
        <Popover className={style({ display: "inline-block" })}>
            <ControlGroup>
                <Button onClick={createMemoNoTemplate}>Add memo</Button>
                <Popover.Button aria-haspopup>
                    <BiCaretDown
                        className={style({ verticalAlign: "middle" })}
                    />
                </Popover.Button>
            </ControlGroup>
            <Popover.Content
                className={style({
                    top: "calc(100% + 0.5em)",
                    right: 0,
                    overflow: "hidden",
                    minWidth: "8em",
                    whiteSpace: "nowrap",
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
                                "--size": "1.5em",
                            })}
                        />
                    }
                >
                    <CreateTemplateMemoButtonList bookHandle={bookHandle} />
                </Suspense>
            </Popover.Content>
        </Popover>
    );
};
