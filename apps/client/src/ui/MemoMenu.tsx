import { Button, Modal } from "@acalyle/ui";
import { style } from "@macaron-css/core";
import { cloneElement, useState } from "react";
import type { IconBaseProps } from "react-icons";
import { BiDotsVertical, BiEditAlt } from "react-icons/bi";

export const MemoMenu: React.FC<{
    onEdit?: () => void;
}> = ({ onEdit }) => {
    const [isOpenMenuPopup, setIsOpenMenuPopup] = useState(false);

    const buttons: readonly {
        icon: JSX.Element;
        text: string;
        onClick: (() => void) | undefined;
    }[] = [
        {
            icon: <BiEditAlt />,
            text: "Edit contents",
            onClick: onEdit,
        },
    ];

    return (
        <div className={style({ position: "relative" })}>
            <Button
                variant="icon"
                onClick={e => {
                    e.stopPropagation();
                    setIsOpenMenuPopup(isOpen => !isOpen);
                }}
                className={style({ borderRadius: "50%" })}
            >
                <BiDotsVertical className={style({ verticalAlign: "top" })} />
            </Button>
            <Modal
                open={isOpenMenuPopup}
                onClose={() => setIsOpenMenuPopup(false)}
                variant="popup"
                className={style({
                    top: "calc(100% + 0.5em)",
                    right: 0,
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    backgroundColor: "#222",
                    borderRadius: "0.25em",
                    boxShadow: "0 0 2em #111",
                })}
            >
                <div role="menu">
                    {buttons.map(({ icon, text, onClick }) => (
                        <Button
                            key={text}
                            role="menuitem"
                            onClick={onClick}
                            variant="unstyled"
                            className={style({
                                display: "block",
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
            </Modal>
        </div>
    );
};
