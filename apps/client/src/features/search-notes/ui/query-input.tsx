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
      {lexQuery(query).map((token, i) => {
        switch (token.type) {
          case "ignore": {
            return <span key={i}>{token.content}</span>;
          }
          case "word": {
            return (
              <span key={i}>
                {token.exclude && <span className=":uno: text-red">-</span>}
                {token.quoted ?
                  <span className=":uno: text-blue-8">
                    {token.content.split(/(\\.)/gv).map((str, i) => (
                      <span key={i} data-escape={!!(i & 1)}>
                        {str}
                      </span>
                    ))}
                  </span>
                : token.content}
              </span>
            );
          }
          case "tag": {
            return (
              <span key={i}>
                {token.exclude && <span className=":uno: text-red">-</span>}
                <span className=":uno: text-green-6">{token.symbol}</span>
                {token.prop != null && (
                  <>
                    :<span className=":uno: text-yellow-6">{token.prop}</span>
                  </>
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
