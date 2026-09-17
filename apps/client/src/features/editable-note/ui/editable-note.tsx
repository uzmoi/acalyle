import { Button, Popover } from "@acalyle/ui";
import { useState } from "react";
import { LuBookOpenText, LuEllipsis, LuPencilLine } from "react-icons/lu";
import type { BookId } from "#/entities/book";
import type { Note } from "#/entities/note";
import { NoteActionList } from "#/features/note-action";
import { saveNoteContents } from "../model/save";
import { NoteContentsEditor } from "./note-contents-editor";
import { NoteContentsView } from "./note-contents-view";

export const EditableNote: React.FC<{
  bookId: BookId;
  note: Note;
}> = ({ note }) => {
  const [isRawText, setIsRawText] = useState(false);

  const toggleIsRawText = (): void => {
    setIsRawText(!isRawText);
  };

  return (
    <article data-note-id={note.id}>
      <header className=":uno: flex gap-2 items-center">
        <div className=":uno: flex-1" />
        <Button
          onClick={toggleIsRawText}
          className=":uno: p-2 rounded text-4 line-height-4 b-none"
        >
          {isRawText ?
            <LuBookOpenText className=":uno: align-top" title="preview" />
          : <LuPencilLine className=":uno: align-top" title="edit" />}
        </Button>
        <Popover>
          <Popover.Button
            aria-haspopup
            className=":uno: p-2 rounded text-4 line-height-4 b-none"
          >
            <LuEllipsis className=":uno: align-top" title="note actions" />
          </Popover.Button>
          <Popover.Content
            closeOnClick
            className=":uno: right-0 top-[calc(100%+0.5rem)] overflow-hidden ws-nowrap"
          >
            <NoteActionList noteIds={new Set([note.id])} />
          </Popover.Content>
        </Popover>
      </header>

      {isRawText ?
        <NoteContentsEditor
          initialValue={note.contents}
          onChange={contents => {
            saveNoteContents(note.id, contents);
          }}
        />
      : <NoteContentsView contents={note.contents} />}
    </article>
  );
};
