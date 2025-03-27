import { cx, style } from "@acalyle/css";
import { Button, List } from "@acalyle/ui";
import { BiSolidEdit, BiX } from "react-icons/bi";
import type { BookRef } from "~/entities/book";
import { type NoteId, type NoteTagString, TagList } from "~/entities/note";
import { theme } from "~/theme";
import { useEditableTags } from "../model";
import { TagUpsertForm } from "./tag-upsert-form";

// TODO: 編集中にタグリストをクリックしてTagUpsertFormに反映させる。
// TODO: symbolが一致するタグがあったら一致するタグをハイライトする。

export const EditableTags: React.FC<{
  bookRef: BookRef;
  noteId: NoteId;
  tags: readonly NoteTagString[];
}> = ({ bookRef, noteId, tags }) => {
  const [state, { start, end, upsertTag, removeTag }] = useEditableTags();

  const onOpen = (): void => {
    start(tags);
  };
  const onClose = (): void => {
    end(noteId, tags);
  };

  return (
    // IDEA: Popoverかmodal使う？
    <div className=":uno: relative">
      {state == null ?
        <TagList tags={tags} className=":uno: inline-block" />
      : <List className=":uno: inline-block">
          {state.tags.map(tag => (
            <List.Item key={tag.symbol} className=":uno: inline-block px-0.5">
              <span>{tag.toString()}</span>
              <Button onClick={() => removeTag(tag.symbol)} unstyled>
                <BiX />
              </Button>
            </List.Item>
          ))}
        </List>
      }
      {state == null && (
        <Button unstyled onClick={onOpen}>
          <BiSolidEdit />
        </Button>
      )}
      {state != null && (
        <div
          className={cx(
            ":uno: absolute top-[calc(100%+0.5em)] px-3 py-2 rounded-4",
            style({ backgroundColor: theme("note-bg") }),
          )}
        >
          <TagUpsertForm
            bookRef={bookRef}
            noteId={noteId}
            onUpsert={upsertTag}
          />
          <Button onClick={onClose}>save</Button>
        </div>
      )}
    </div>
  );
};
