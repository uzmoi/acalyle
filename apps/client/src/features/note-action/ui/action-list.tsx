import { Menu } from "@acalyle/ui";
import type { NoteId } from "~/entities/note";
import { noteActions } from "../model";

export const NoteActionList: React.FC<{
  noteIds: ReadonlySet<NoteId>;
}> = ({ noteIds }) => {
  const actions = noteActions(noteIds);

  return (
    <Menu>
      {actions.map(({ icon, text, disabled, type, action }, i) => (
        <Menu.Item
          key={i}
          disabled={disabled}
          onClick={() => {
            void action?.();
          }}
          data-type={type}
          className=":uno: enabled:data-[type=danger]:is-[:hover,:focus]:text-red"
        >
          {icon}
          <span className=":uno: ml-2 align-middle">{text}</span>
        </Menu.Item>
      ))}
    </Menu>
  );
};
