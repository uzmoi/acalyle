import { Popover } from "@acalyle/ui";
import { isNotNil } from "es-toolkit";
import { useState } from "react";
import type { BookId } from "#entities/book";
import { type Note, TagList } from "#entities/note";
import { parseTag } from "#entities/tag";
import { TagSelectForm } from "#features/editable-tags";
import { NoteActionButton } from "#features/note-action";
import { DateTimeView } from "#shared/ui";

export const NoteHeader: React.FC<{
  bookId: BookId;
  note: Note;
}> = ({ bookId, note }) => {
  const [tags, updateTags] = useState(note.tags);

  const tagsSet = new Set(
    tags
      .map(parseTag)
      .filter(isNotNil)
      .map(x => x.symbol),
  );

  return (
    <header className=":uno: px-2 py-1">
      <div className=":uno: flex items-center">
        <div className=":uno: flex-1 text-size-xs text-gray-3">
          <p>
            updated <DateTimeView dt={note.updatedAt} />
          </p>
          <p>
            created <DateTimeView dt={note.createdAt} />
          </p>
        </div>
        <NoteActionButton noteIds={new Set([note.id])} />
      </div>
      <div className=":uno: mt-1">
        <TagList tags={tags} />
        <Popover>
          <Popover.Button>Edit</Popover.Button>
          <Popover.Content>
            <TagSelectForm
              bookId={bookId}
              selection={tagsSet}
              addTag={symbol => {
                updateTags(tags => [...tags, symbol]);
              }}
              removeTag={symbol => {
                updateTags(tags =>
                  tags.filter(tag => parseTag(tag)?.symbol !== symbol),
                );
              }}
            />
          </Popover.Content>
        </Popover>
      </div>
    </header>
  );
};
