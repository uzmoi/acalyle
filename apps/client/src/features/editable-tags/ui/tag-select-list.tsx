import { List } from "@acalyle/ui";
import { useId } from "react";
import type { BookId } from "~/entities/book";
import { Tag, type TagSymbol } from "~/entities/tag";
import { useFilteredTags } from "../model";

export const TagSelectList: React.FC<{
  bookId: BookId;
  query: string;
  selection: ReadonlySet<TagSymbol>;
  addTag: (tag: TagSymbol) => void;
  removeTag: (tag: TagSymbol) => void;
}> = ({ bookId, query, selection, addTag, removeTag }) => {
  const id = useId();
  const tags = useFilteredTags(bookId, query);

  if (tags.length === 0) {
    return (
      <div className=":uno: m-auto px-1 py-2 text-center text-sm">
        タグが見つかりません。
      </div>
    );
  }

  return (
    <List>
      {tags.map(({ symbol, description }) => (
        <List.Item
          key={symbol}
          className=":uno: relative select-none p-1 has-focus-visible:bg-zinc-700 hover:bg-zinc-700"
        >
          {/* TODO: <Checkbox /> として切り出す */}
          <input
            type="checkbox"
            id={id + symbol}
            className=":uno: before:(absolute inset-0 cursor-pointer content-empty)"
            checked={selection.has(symbol)}
            onChange={event => {
              if (event.target.checked) {
                addTag(symbol);
              } else {
                removeTag(symbol);
              }
            }}
          />
          <label htmlFor={id + symbol} className=":uno: ml-2">
            <Tag tag={symbol} />
          </label>
          <p className=":uno: text-xs text-gray">{description}</p>
        </List.Item>
      ))}
    </List>
  );
};
