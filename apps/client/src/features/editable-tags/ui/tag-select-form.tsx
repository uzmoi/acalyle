import { TextInput } from "@acalyle/ui";
import { useId, useState } from "react";
import type { BookId } from "~/entities/book";
import type { TagSymbol } from "~/entities/tag";
import { TagSelectList } from "./tag-select-list";

const focus = (el: HTMLElement | null): void => {
  el?.focus();
};

export const TagSelectForm: React.FC<{
  bookId: BookId;
  selection: ReadonlySet<TagSymbol>;
  addTag: (tag: TagSymbol) => void;
  removeTag: (tag: TagSymbol) => void;
}> = ({ bookId, selection, addTag, removeTag }) => {
  const id = useId();
  const [query, setQuery] = useState("");

  return (
    <div className=":uno: line-height-none">
      <div className=":uno: b b-b-zinc-600 b-b-solid p-1">
        <label htmlFor={id} className=":uno: px-1 text-xs">
          タグ検索
        </label>
        <TextInput
          ref={focus}
          id={id}
          value={query}
          onValueChange={setQuery}
          className=":uno: mt-1"
        />
      </div>
      <TagSelectList
        bookId={bookId}
        query={query}
        selection={selection}
        addTag={addTag}
        removeTag={removeTag}
      />
    </div>
  );
};
