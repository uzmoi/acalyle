import { Button, Popover } from "@acalyle/ui";
import { style } from "@macaron-css/core";
import { cloneElement } from "react";
import type { IconBaseProps } from "react-icons";
import { BiDotsVertical } from "react-icons/bi";

export type MenuAction = {
    icon: JSX.Element;
    text: string;
    color?: string;
    onClick: (() => void) | undefined;
};

export const MemoMenu: React.FC<{
    actions: readonly MenuAction[];
}> = ({ actions }) => {
    return (
        <Popover>
            <Popover.Button
                variant="icon"
                className={style({ borderRadius: "50%" })}
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
                    {actions.map(({ icon, text, color, onClick }) => (
                        <Button
                            key={text}
                            role="menuitem"
                            onClick={onClick}
                            style={{ color }}
                            variant="unstyled"
                            className={style({
                                display: "block",
                                width: "100%",
                                padding: "0.25em 1em",
                                fontSize: "0.9em",
                                fontWeight: "normal",
                                textAlign: "start",
                                selectors: {
                                    "& + &": {
                                        borderTop: "1px solid #666",
                                    },
                                    "&:not(:disabled):is(:hover, :focus)": {
                                        backgroundColor: "#fff2",
                                    },
                                },
                            })}
                        >
                            {cloneElement<IconBaseProps>(icon, {
                                className: style({ verticalAlign: "middle" }),
                            })}
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
