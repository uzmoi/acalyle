import { Popover, closePopover } from "@acalyle/ui";
import { style } from "@macaron-css/core";
import { BiPlus } from "react-icons/bi";
import { AddTagForm } from "./AddTagForm";

export const AddTagButton: React.FC<{
    bookHandle: string;
    memoId: string;
}> = ({ bookHandle, memoId }) => {
    return (
        <Popover className={style({ display: "inline-block" })}>
            <Popover.Button variant="unstyled">
                <BiPlus className={style({ verticalAlign: "middle" })} />
            </Popover.Button>
            <Popover.Content
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
                    onCompleted={closePopover}
                />
            </Popover.Content>
        </Popover>
    );
};
