import { Popover } from "@acalyle/ui";
import { TagSelectForm } from "#features/editable-tags";
import type { BookId } from "~/entities/book";
import { appendTag, parseQuery, removeTag } from "../model";
import { QueryInput } from "./query-input";

export const SearchBox: React.FC<{
  bookId: BookId;
  query: string;
  setQuery: (query: string) => void;
}> = ({ bookId, query, setQuery }) => {
  const tagSymbols = new Set(
    parseQuery(query)
      .filter(q => q.type === "tag")
      .map(q => q.symbol),
  );

  return (
    <div>
      <QueryInput query={query} setQuery={setQuery} />
      <div className=":uno: mt-2 flex gap-2">
        <Popover>
          <Popover.Button>タグ</Popover.Button>
          {/* TODO: !important を削除してテーマに従う */}
          <Popover.Content className=":uno: z-1 p-1 line-height-none !b-zinc !bg-zinc-800">
            <TagSelectForm
              bookId={bookId}
              selection={tagSymbols}
              addTag={tag => {
                setQuery(appendTag(query, tag));
              }}
              removeTag={tag => {
                setQuery(removeTag(query, tag));
              }}
            />
          </Popover.Content>
        </Popover>
      </div>
    </div>
  );
};
