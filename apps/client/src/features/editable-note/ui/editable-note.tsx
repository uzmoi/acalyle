import { Button } from "@acalyle/ui";
import { useState } from "react";
import { LuBookOpenText, LuPencilLine } from "react-icons/lu";
import type { Note } from "#/entities/note";
import { NoteContentsEditor } from "./note-contents-editor";
import { NoteContentsView } from "./note-contents-view";

export const EditableNote: React.FC<{
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
      </header>

      {isRawText ?
        <NoteContentsEditor initialValue={note.contents} />
      : <NoteContentsView contents={note.contents} />}
    </article>
  );
};
