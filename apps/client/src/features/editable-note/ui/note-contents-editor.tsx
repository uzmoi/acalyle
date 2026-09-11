import { useState } from "react";
import { useEditatePlainEditor } from "#/shared/utils";

export const NoteContentsEditor: React.FC<{
  initialValue: string;
}> = ({ initialValue }) => {
  const [contents, setContents] = useState(initialValue);

  const [editorEl] = useEditatePlainEditor<HTMLDivElement>({
    text: initialValue,
    onChange: setContents,
  });

  return (
    <div ref={editorEl} className=":uno: p-2 outline-none font-mono">
      {contents.split("\n").map((line, index) => (
        <div key={index}>{line || <br />}</div>
      ))}
    </div>
  );
};
