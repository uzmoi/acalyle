import { List, TextInput } from "@acalyle/ui";
import { useId, useState } from "react";
import type { BookId } from "~/entities/book";
import type { QueryItem } from "../model";

const focus = (el: HTMLElement | null): void => {
  el?.focus();
};

export const TagForm: React.FC<{
  bookId: BookId;
  query: readonly QueryItem[];
  xorTag: (tag: string) => void;
}> = ({ query, xorTag }) => {
  const id = useId();
  const [tagQuery, setTagQuery] = useState("");

  const filtered = ([] as { tag: string; description: string }[]).filter(
    ({ tag, description }) =>
      tag.includes(tagQuery) || description.includes(tagQuery),
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
          {filtered.map(({ tag, description }) => (
            <List.Item
              key={tag}
              className=":uno: relative select-none p-1 has-focus-visible:bg-zinc-700 hover:bg-zinc-700"
            >
              {/* TODO: <Checkbox /> として切り出す */}
              <input
                type="checkbox"
                id={id + tag}
                className=":uno: before:(absolute inset-0 cursor-pointer content-empty)"
                checked={query.some(q => q.type === "tag" && q.symbol === tag)}
                onChange={() => {
                  xorTag(tag);
                }}
              />
              <label htmlFor={id + tag} className=":uno: ml-2 text-sm">
                {tag}
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
