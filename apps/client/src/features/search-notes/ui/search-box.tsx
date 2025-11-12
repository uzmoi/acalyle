import { Popover } from "@acalyle/ui";
import { TagSelectForm } from "#features/editable-tags";
import type { BookId } from "~/entities/book";
import { appendTag, parseQuery, removeTag } from "../model";
import { QueryInput } from "./query-input";

export const SearchBox: React.FC<{
  bookId: BookId;
  query: string;
  setQuery: (query: string | ((query: string) => string)) => void;
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
          <Popover.Content className=":uno: z-1">
            <TagSelectForm
              bookId={bookId}
              selection={tagSymbols}
              addTag={tag => {
                setQuery(query => appendTag(query, tag));
              }}
              removeTag={tag => {
                setQuery(query => removeTag(query, tag));
              }}
            />
          </Popover.Content>
        </Popover>
      </div>
    </div>
  );
};
