import { Button, vars } from "@acalyle/ui";
import { style } from "@macaron-css/core";
import { useState } from "react";
import { BiEditAlt } from "react-icons/bi";
import type { Scalars } from "~/__generated__/graphql";
import { MemoContentsEditor } from "../MemoContentsEditor";
import { NoteBody } from "./NoteBody";
import { useNote } from "./use-note";

export const NoteContents: React.FC<{
    noteId: Scalars["ID"];
}> = ({ noteId }) => {
    const note = useNote(noteId);
    const [isInEdit, setIsInEdit] = useState(false);

    if (note == null) return null;

    return (
        <div
            className={style({
                // FIXME: margin
                marginTop: "1em",
                position: "relative",
            })}
        >
            <Button
                variant="unstyled"
                className={style({
                    position: "absolute",
                    top: 0,
                    right: 0,
                    translate: "50% -50%",
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
            {isInEdit ? (
                <MemoContentsEditor
                    noteId={noteId}
                    onEditEnd={() => {
                        setIsInEdit(false);
                    }}
                />
            ) : (
                <NoteBody contents={note.contents} />
            )}
        </div>
    );
};
