import { style } from "@acalyle/css";
import { Popover, closePopover } from "@acalyle/ui";
import { BiPlus } from "react-icons/bi";
import type { BookRef } from "~/book/store";
import { AddTagForm } from "~/ui/AddTagForm";
import { TimeStamp } from "~/ui/TimeStamp";
import type { Note } from "../store";
import { MIN_NOTE_WIDTH } from "./constants";
import { NoteMenuButton } from "./note-menu";
import { TagList } from "./tag-list";

/** @package */
export const NoteHeader: React.FC<{
    bookRef: BookRef;
    note: Note;
}> = ({ bookRef, note }) => {
    return (
        <header
            className={style({ minWidth: MIN_NOTE_WIDTH, padding: "0.5em" })}
        >
            <div className={style({ display: "flex", alignItems: "center" })}>
                <div className={style({ flex: "1 0", fontSize: "0.725em" })}>
                    <p>
                        updated <TimeStamp dt={note.updatedAt} />
                    </p>
                    <p>
                        created <TimeStamp dt={note.createdAt} />
                    </p>
                </div>
                <NoteMenuButton noteId={note.id} />
            </div>
            <div className={style({ marginTop: "0.25em" })}>
                <TagList
                    tags={note.tags}
                    className={style({ display: "inline-block" })}
                />
                <Popover className={style({ display: "inline-block" })}>
                    <Popover.Button unstyled>
                        <BiPlus />
                    </Popover.Button>
                    <Popover.Content
                        className={style({
                            top: "calc(100% + 0.5em)",
                            whiteSpace: "nowrap",
                        })}
                    >
                        <AddTagForm
                            bookHandle={bookRef}
                            memoId={note.id}
                            onCompleted={closePopover}
                        />
                    </Popover.Content>
                </Popover>
            </div>
        </header>
    );
};
