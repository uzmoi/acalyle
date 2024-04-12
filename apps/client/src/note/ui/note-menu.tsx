import { Menu, Popover, vars } from "@acalyle/ui";
import { style } from "@macaron-css/core";
import {
    BiClipboard,
    BiDotsVertical,
    BiTransfer,
    BiTrash,
} from "react-icons/bi";
import type { ID } from "~/__generated__/graphql";
import { removeNote, transferNote } from "~/note/store/note";
import { confirm, selectBook } from "~/ui/modal";

type MenuAction = {
    icon: JSX.Element;
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

export const NoteMenuButton: React.FC<{
    noteId: ID;
}> = ({ noteId }) => {
    const actions = noteActions(noteId);

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
                <BiDotsVertical className={style({ verticalAlign: "top" })} />
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
                                selectors: {
                                    '&[data-type="danger"]:enabled:is(:hover, :focus)':
                                        {
                                            color: vars.color.danger,
                                        },
                                },
                            })}
                        >
                            {icon}
                            <span
                                className={style({
                                    marginLeft: "0.5em",
                                    verticalAlign: "middle",
                                })}
                            >
                                {text}
                            </span>
                        </Menu.Item>
                    ))}
                </Menu>
            </Popover.Content>
        </Popover>
    );
};
