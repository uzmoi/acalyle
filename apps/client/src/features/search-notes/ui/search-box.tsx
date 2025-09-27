import { Popover } from "@acalyle/ui";
import type { BookId } from "~/entities/book";
import { parseQuery } from "../model";
import { QueryInput } from "./query-input";
import { TagForm } from "./tag-form";

export const SearchBox: React.FC<{
  bookId: BookId;
  query: string;
  setQuery: (query: string) => void;
}> = ({ bookId, query, setQuery }) => {
  return (
    <div>
      <QueryInput query={query} setQuery={setQuery} />
      <div className=":uno: mt-2 flex gap-2">
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
