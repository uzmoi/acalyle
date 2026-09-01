import { Button, ControlGroup, TextArea } from "@acalyle/ui";
import { cx, style } from "asarina";
import { useState } from "react";
import type { NoteId } from "#/entities/note";
import { tth } from "#/entities/theme";
import { updateNoteContents } from "../model/mutation";

export const NoteContentsEditor: React.FC<{
  noteId: NoteId;
  initialValue: string;
  onEnd?: () => void;
}> = ({ noteId, initialValue, onEnd }) => {
  const [contents, setContents] = useState(initialValue);

  const handleValueChange = (value: string): void => {
    setContents(value);
  };

  const action = async (): Promise<void> => {
    await updateNoteContents(noteId, contents);
    onEnd?.();
  };

  return (
    <form action={action}>
      <TextArea
        value={contents}
        onValueChange={handleValueChange}
        unstyled
        // NOTE: NoteBodyで[NoteContents](apps/client/src/entities/note/ui/contents.tsx)と入れ変わるので同じスタイルになるのが望ましい。
        // TODO: もうちょっとマシな作り方があるだろﾊﾞｶﾔﾛｺﾉﾔﾛｵﾒｪ
        className={cx(
          ":uno: py-1 px-3",
          style(tth.style("note-bg", "note-text")),
        )}
      />
      <ControlGroup className=":uno: mr-4 mt-2 flex justify-right">
        <Button onClick={onEnd}>Cancel</Button>
        <Button type="submit">Save</Button>
      </ControlGroup>
    </form>
  );
};
