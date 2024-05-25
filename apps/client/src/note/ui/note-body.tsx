import { style } from "@acalyle/css";
import { Button, corner, vars } from "@acalyle/ui";
import { useState } from "react";
import { BiEditAlt } from "react-icons/bi";
import type { ID } from "~/__generated__/graphql";
import { MemoContentsEditor } from "../../ui/MemoContentsEditor";
import { MIN_NOTE_WIDTH } from "./constants";
import { useNote } from "./hook";
import { NoteContents } from "./note-contents";

/** @package */
export const NoteBody: React.FC<{
    noteId: ID;
}> = ({ noteId }) => {
    const note = useNote(noteId);
    const [isInEdit, setIsInEdit] = useState(false);

    if (note == null) return null;

    return (
        <div
            className={style({
                position: "relative",
                minWidth: MIN_NOTE_WIDTH,
            })}
        >
            <Button
                variant="unstyled"
                className={style({
                    ...corner("upper", "right"),
                    padding: "0.25em",
                    lineHeight: 1,
                    borderRadius: "50%",
                    backgroundColor: vars.color.bg.inline,
                    zIndex: vars.zIndex.max,
                    "&:disabled": { visibility: "hidden" },
                    // <NoteContents />もしくはこのボタンに:hover時のみ可視化
                    transition: "opacity 125ms",
                    opacity: 0,
                    ":hover > &, &:hover": { opacity: 1 },
                })}
                onClick={() => {
                    setIsInEdit(true);
                }}
                disabled={isInEdit}
                aria-label="Edit contents"
            >
                <BiEditAlt />
            </Button>
            {isInEdit ?
                <MemoContentsEditor
                    noteId={noteId}
                    onEditEnd={() => {
                        setIsInEdit(false);
                    }}
                />
            :   <NoteContents contents={note.contents} />}
        </div>
    );
};
