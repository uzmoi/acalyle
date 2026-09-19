import { useState } from "react";
import { useEditatePlainEditor } from "#/shared/utils";

export const NoteContentsEditor: React.FC<{
  initialValue: string;
  onChange?: (contents: string) => void;
  readonly?: boolean;
}> = ({ initialValue, onChange, readonly }) => {
  const [contents, setContents] = useState(initialValue);

  const [editorEl] = useEditatePlainEditor<HTMLDivElement>({
    text: initialValue,
    readonly: !!readonly,
    onChange: contents => {
      setContents(contents);
      onChange?.(contents);
    },
  });

  return (
    <div ref={editorEl} className=":uno: p-2 outline-none font-mono">
      {contents.split("\n").map((line, index) => (
        <div key={index}>{line || <br />}</div>
      ))}
    </div>
  );
};
