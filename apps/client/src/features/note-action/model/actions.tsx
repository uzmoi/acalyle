import { BiClipboard, BiTrash } from "react-icons/bi";
import type { NoteId } from "~/entities/note";
import { confirm } from "~/features/modal";
import { removeNote } from "./mutation";

export interface MenuAction {
  icon: React.ReactElement;
  text: string;
  disabled?: boolean;
  type?: "danger";
  action: () => void | Promise<void>;
}

export const noteActions = (
  noteIds: ReadonlySet<NoteId>,
): readonly MenuAction[] => [
  {
    icon: <BiClipboard />,
    text: "Copy note id",
    async action() {
      await navigator.clipboard.writeText([...noteIds].join("\n"));
    },
  },
  {
    icon: <BiTrash />,
    text: "Remove note",
    type: "danger",
    async action() {
      const message =
        noteIds.size === 1 ?
          "Remove note. Are you sure?"
        : `Remove ${noteIds.size} notes. Are you sure?`;

      if (await confirm(message)) {
        void removeNote([...noteIds]);
      }
    },
  },
];
