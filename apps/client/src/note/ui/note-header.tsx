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
        <header className=":uno: px-2 py-1">
            <div className=":uno: flex items-center">
                <div className=":uno: flex-1 text-size-xs text-gray-3">
                    <p>
                        updated <TimeStamp dt={note.updatedAt} />
                    </p>
                    <p>
                        created <TimeStamp dt={note.createdAt} />
                    </p>
                </div>
                <NoteMenuButton noteId={note.id} />
            </div>
            <div className=":uno: mt-1">
                <TagList tags={note.tags} className=":uno: inline-block" />
                <Popover className=":uno: inline-block">
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
