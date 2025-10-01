import { List, TextInput } from "@acalyle/ui";
import { memoize } from "es-toolkit";
import { use, useId, useState } from "react";
import { type BookId, fetchBookDetail } from "~/entities/book";
import { Tag, type TagSymbol } from "~/entities/tag";
import type { QueryItem } from "../model";

const focus = (el: HTMLElement | null): void => {
  el?.focus();
};

const memoizedFetchBookDetail = /* #__PURE__ */ memoize(fetchBookDetail);

export const TagForm: React.FC<{
  bookId: BookId;
  query: readonly QueryItem[];
  addTag: (tag: TagSymbol) => void;
  removeTag: (tag: TagSymbol) => void;
}> = ({ bookId, query, addTag, removeTag }) => {
  const id = useId();
  const [tagQuery, setTagQuery] = useState("");
  const tags = use(memoizedFetchBookDetail(bookId)).mapOr(
    [],
    bookDetail =>
      bookDetail?.tags
        .values()
        .filter(tag => tag.symbol.startsWith("#"))
        .toArray() ?? [],
  );

  const filtered = tags.filter(
    ({ symbol, description }) =>
      symbol.includes(tagQuery) || description.includes(tagQuery),
  );

  return (
    <div>
      <div className=":uno: b b-b-zinc-600 b-b-solid pb-1">
        <label htmlFor={id} className=":uno: px-1 text-xs">
          タグ検索
        </label>
        <TextInput
          ref={focus}
          id={id}
          value={tagQuery}
          onValueChange={setTagQuery}
          className=":uno: mt-1"
        />
      </div>
      {filtered.length > 0 ?
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
                checked={query.some(
                  q => q.type === "tag" && q.symbol === symbol,
                )}
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
      : <div className=":uno: m-auto px-1 py-2 text-center text-sm">
          タグが見つかりません。
        </div>
      }
    </div>
  );
};
