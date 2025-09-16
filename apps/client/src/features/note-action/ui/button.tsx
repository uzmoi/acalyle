import { Popover } from "@acalyle/ui";
import { BiDotsVertical } from "react-icons/bi";
import type { NoteId } from "~/entities/note";
import { NoteActionList } from "./action-list";

export const NoteActionButton: React.FC<{
  noteIds: ReadonlySet<NoteId>;
}> = ({ noteIds }) => {
  return (
    <Popover>
      <Popover.Button
        aria-haspopup
        className=":uno: b-0 rounded-50% p-1 text-size-xl line-height-4"
      >
        <BiDotsVertical className=":uno: align-top" />
      </Popover.Button>
      <Popover.Content
        closeOnClick
        className=":uno: right-0 top-[calc(100%+0.5em)] overflow-hidden ws-nowrap"
      >
        <NoteActionList noteIds={noteIds} />
      </Popover.Content>
    </Popover>
  );
};
