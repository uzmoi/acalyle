import { base } from "@acalyle/ui";
import { createEditor, plainSchema } from "edix";
import { useEffect, useRef } from "react";
import { type QueryToken, lexQuery } from "../model";

export const SearchBox: React.FC<{
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
    <div>
      <div className={base} ref={ref}>
        {lexQuery(query).map((token, i) => (
          <span key={i}>{renderQueryToken(token)}</span>
        ))}
      </div>
    </div>
  );
};

const renderQueryToken = (token: QueryToken): React.ReactNode => {
  switch (token.type) {
    case "ignore": {
      return token.content;
    }
    case "word": {
      return (
        <>
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
        </>
      );
    }
    case "tag": {
      return (
        <>
          {token.exclude && <span className=":uno: text-red">-</span>}
          <span className=":uno: text-green-6">{token.symbol}</span>
          {token.prop != null && (
            <>
              :<span className=":uno: text-yellow-6">{token.prop}</span>
            </>
          )}
        </>
      );
    }
    // No Default: Returned in all cases.
  }
};
