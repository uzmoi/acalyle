import { Button, corner, vars } from "@acalyle/ui";
import { style } from "@macaron-css/core";
import { useState } from "react";
import { BiEditAlt } from "react-icons/bi";
import type { ID } from "~/__generated__/graphql";
import { MemoContentsEditor } from "../../ui/MemoContentsEditor";
import { useNote } from "./hook";
import { NoteContents } from "./note-contents";

export const NoteBody: React.FC<{
    noteId: ID;
}> = ({ noteId }) => {
    const note = useNote(noteId);
    const [isInEdit, setIsInEdit] = useState(false);

    if (note == null) return null;

    return (
        <div className={style({ position: "relative" })}>
            <Button
                variant="unstyled"
                className={style({
                    ...corner("upper", "right"),
                    padding: "0.25em",
                    lineHeight: 1,
                    borderRadius: "50%",
                    backgroundColor: vars.color.bg.inline,
                    zIndex: vars.zIndex.max,
                    ":disabled": {
                        visibility: "hidden",
                    },
                    transition: "opacity 125ms",
                    opacity: 0,
                    selectors: {
                        ":hover > &, &:hover": {
                            opacity: 1,
                        },
                    },
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
