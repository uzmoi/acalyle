import { NoteTag } from "@acalyle/core";
import { base } from "@acalyle/ui";
import { createEditor, plainSchema } from "edix";
import { useEffect, useRef } from "react";
import { lexQuery } from "../model";

export const QueryInput: React.FC<{
  query: string;
  setQuery: (query: string) => void;
}> = ({ query, setQuery }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current == null) return;
    const editor = createEditor({
      doc: "",
      schema: plainSchema({ multiline: true }),
      onChange(value) {
        setQuery(value);
      },
    });
    return editor.input(ref.current);
  }, [setQuery]);

  return (
    <div className={base} ref={ref}>
      {[...lexQuery(query)].map(({ type, content }, i) => {
        switch (type) {
          case "ignore": {
            return <span key={i}>{content}</span>;
          }
          case "op": {
            return (
              <span key={i} className=":uno: text-orange">
                {content}
              </span>
            );
          }
          case "word:quoted": {
            return (
              <span key={i} className=":uno: text-green-2">
                {content.split(/(\\.)/gv).map((str, i) => (
                  <span
                    key={i}
                    data-escape={!!(i & 1)}
                    className=":uno: data-[escape=true]:text-cyan"
                  >
                    {str}
                  </span>
                ))}
              </span>
            );
          }
          case "word": {
            return <span key={i}>{content}</span>;
          }
          case "tag": {
            const tag = NoteTag.parse(content);

            return (
              <span key={i}>
                <span className=":uno: text-blue-3">
                  {tag.hasHead && tag.head}
                  {tag.path.join("/")}
                </span>
                {(content.endsWith(":") || tag.prop) && (
                  <span className=":uno: text-fuchsia-3">:{tag.prop}</span>
                )}
              </span>
            );
          }
          // No Default: Returned in all cases.
        }
      })}
    </div>
  );
};
