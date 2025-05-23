import { style } from "@acalyle/css";
import { Menu, Popover, vars } from "@acalyle/ui";
import {
    BiClipboard,
    BiDotsVertical,
    BiTransfer,
    BiTrash,
} from "react-icons/bi";
import type { ID } from "~/lib/graphql";
import { removeNote, transferNote } from "~/note/store/note";

const confirm = (_text: string): Promise<boolean> => Promise.resolve(false);

const selectBook = (): Promise<ID | void> => Promise.resolve();

type MenuAction = {
    icon: React.ReactElement;
    text: string;
    disabled?: boolean;
    type?: "danger";
    onClick: (() => void | Promise<void>) | undefined;
};

const noteActions = (noteId: ID): readonly MenuAction[] => [
    {
        icon: <BiClipboard />,
        text: "Copy memo id",
        onClick() {
            void navigator.clipboard.writeText(noteId);
        },
    },
    {
        icon: <BiTransfer />,
        text: "Transfer memo",
        async onClick() {
            const bookId = await selectBook();
            if (bookId != null) {
                void transferNote(noteId, bookId);
            }
        },
    },
    {
        icon: <BiTrash />,
        text: "Delete memo",
        type: "danger",
        async onClick() {
            const ok = await confirm("Delete memo");
            if (ok) {
                void removeNote(noteId);
            }
        },
    },
];

/** @package */
export const NoteMenuButton: React.FC<{
    noteId: ID;
}> = ({ noteId }) => {
    return (
        <Popover>
            <Popover.Button
                aria-haspopup
                className={style({
                    borderRadius: "50%",
                    padding: "0.25em",
                    fontSize: "1.25em",
                    lineHeight: 1,
                    border: 0,
                })}
            >
                <BiDotsVertical className=":uno: align-top" />
            </Popover.Button>
            <Popover.Content
                closeOnClick
                className={style({
                    top: "calc(100% + 0.5em)",
                    right: 0,
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                })}
            >
                <NoteMenuContent noteId={noteId} />
            </Popover.Content>
        </Popover>
    );
};

/** @package */
export const NoteMenuContent: React.FC<{
    noteId: ID;
}> = ({ noteId }) => {
    const actions = noteActions(noteId);

    return (
        <Menu>
            {actions.map(({ icon, text, disabled, type, onClick }) => (
                <Menu.Item
                    key={text}
                    disabled={disabled}
                    onClick={() => {
                        void onClick?.();
                    }}
                    data-type={type}
                    className={style({
                        '&[data-type="danger"]:enabled:is(:hover, :focus)': {
                            color: vars.color.danger,
                        },
                    })}
                >
                    {icon}
                    <span className=":uno: ml-2 align-middle">{text}</span>
                </Menu.Item>
            ))}
        </Menu>
    );
};
