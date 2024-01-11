import { Button, Popover, vars } from "@acalyle/ui";
import { style } from "@macaron-css/core";
import { BiDotsVertical } from "react-icons/bi";

export type MenuAction = {
    icon: JSX.Element;
    text: string;
    disabled?: boolean;
    type?: "danger";
    onClick: (() => void | Promise<void>) | undefined;
};

export const NoteMenu: React.FC<{
    actions: readonly MenuAction[];
}> = ({ actions }) => {
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
                <div role="menu">
                    {actions.map(({ icon, text, disabled, type, onClick }) => (
                        <Button
                            key={text}
                            role="menuitem"
                            disabled={disabled}
                            onClick={onClick}
                            data-type={type}
                            variant="unstyled"
                            className={style({
                                display: "block",
                                width: "100%",
                                padding: "0.25em 1em",
                                fontSize: "0.9em",
                                fontWeight: "normal",
                                textAlign: "start",
                                transition:
                                    "background-color 200ms, color 200ms",
                                selectors: {
                                    "& + &": {
                                        borderTop: `1px solid ${vars.color.fg.mute}`,
                                    },
                                    '&[data-type="danger"]:enabled:is(:hover, :focus)':
                                        {
                                            color: vars.color.danger,
                                        },
                                    "&:enabled:is(:hover, :focus)": {
                                        backgroundColor: "#fff2",
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
                        </Button>
                    ))}
                </div>
            </Popover.Content>
        </Popover>
    );
};
