import { cx, style } from "@acalyle/css";
import { Button, ControlGroup, Form, TextArea } from "@acalyle/ui";
import { useState } from "react";
import type { NoteId } from "~/entities/note";
import { theme } from "~/theme";
import { updateNoteContents } from "../model";

export const NoteContentsEditor: React.FC<{
  noteId: NoteId;
  initialValue: string;
  onEnd?: () => void;
}> = ({ noteId, initialValue, onEnd }) => {
  const [contents, setContents] = useState(initialValue);

  const handleValueChange = (value: string) => {
    setContents(value);
  };

  const handleSubmit = () => {
    void updateNoteContents(noteId, contents).then(() => {
      onEnd?.();
    });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <TextArea
        value={contents}
        onValueChange={handleValueChange}
        unstyled
        // NOTE: NoteBodyで[NoteContents](apps/client/src/entities/note/ui/contents.tsx)と入れ変わるので同じスタイルになるのが望ましい。
        // TODO: もうちょっとマシな作り方があるだろﾊﾞｶﾔﾛｺﾉﾔﾛｵﾒｪ
        className={cx(
          ":uno: py-1 px-3",
          style({
            color: theme("note-text"),
            background: theme("note-bg"),
          }),
        )}
      />
      <ControlGroup className=":uno: mr-4 mt-2 flex justify-right">
        <Button onClick={onEnd}>Cancel</Button>
        <Button type="submit">Save</Button>
      </ControlGroup>
    </Form>
  );
};
