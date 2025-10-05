import { List } from "@acalyle/ui";
import { useId } from "react";
import { type BookId, useBookDetail } from "~/entities/book";
import { Tag, type TagSymbol } from "~/entities/tag";

export const TagSelectList: React.FC<{
  bookId: BookId;
  query: string;
  selection: ReadonlySet<TagSymbol>;
  addTag: (tag: TagSymbol) => void;
  removeTag: (tag: TagSymbol) => void;
}> = ({ bookId, query, selection, addTag, removeTag }) => {
  const id = useId();
  const bookDetail = useBookDetail(bookId);
  const tags =
    bookDetail?.tags
      .values()
      .filter(tag => tag.symbol.startsWith("#"))
      .toArray() ?? [];

  const filtered = tags.filter(
    ({ symbol, description }) =>
      symbol.includes(query) || description.includes(query),
  );

  if (filtered.length === 0) {
    return (
      <div className=":uno: m-auto px-1 py-2 text-center text-sm">
        タグが見つかりません。
      </div>
    );
  }

  return (
    <List>
      {filtered.map(({ symbol, description }) => (
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
