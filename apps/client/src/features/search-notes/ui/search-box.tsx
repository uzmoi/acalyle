import { Popover, base } from "@acalyle/ui";
import { createEditor, plainSchema } from "edix";
import { useEffect, useRef } from "react";
import type { BookId } from "~/entities/book";
import { type QueryToken, lexQuery, parseQuery } from "../model";
import { TagForm } from "./tag-form";

export const SearchBox: React.FC<{
  bookId: BookId;
  query: string;
  setQuery: (query: string) => void;
}> = ({ bookId, query, setQuery }) => {
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
      <div className=":uno: flex gap-2">
        <Popover>
          <Popover.Button>タグ</Popover.Button>
          {/* TODO: !important を削除してテーマに従う */}
          <Popover.Content className=":uno: z-1 p-1 line-height-none !b-zinc !bg-zinc-800">
            <TagForm
              bookId={bookId}
              query={parseQuery(query).toArray()}
              xorTag={tag => {
                // TODO: 空白文字の入り方などを改善、parseQueryに挙動を合わせる
                setQuery(
                  query.includes(tag) ?
                    query.replaceAll(tag, "")
                  : `${query} ${tag}`,
                );
              }}
            />
          </Popover.Content>
        </Popover>
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
