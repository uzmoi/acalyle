import { style } from "@macaron-css/core";
import { timeout } from "emnorst";
import { useCallback } from "react";
import { vars } from "../theme";
import { cx } from "./cx";
import { useTransitionStatus } from "./use-transition-status";

export const Modal: React.FC<{
    open?: boolean;
    className?: string;
    children?: React.ReactNode;
    onClose?: () => void;
    transitionDuration?: number;
}> = ({ open, className, children, onClose, transitionDuration = 200 }) => {
    const transition = useCallback(
        () => timeout(transitionDuration),
        [transitionDuration],
    );
    const status = useTransitionStatus({ show: open, transition });

    const handleClick: React.MouseEventHandler<HTMLDivElement> = e => {
        e.stopPropagation();
        if (e.target === e.currentTarget) {
            onClose?.();
        }
    };

    return (
        <div
            data-open={open}
            data-status={status}
            style={{ transitionDuration: `${transitionDuration}ms` }}
            className={cx(
                style({
                    zIndex: vars.zIndex.modal,
                    position: "fixed",
                    inset: 0,
                    backgroundColor: "#0008",
                    backdropFilter: "blur(0.125em)",
                    transitionProperty: "opacity",
                    selectors: {
                        '&[data-open="false"]': {
                            opacity: 0,
                        },
                        '&[data-status="exited"]': {
                            visibility: "hidden",
                        },
                    },
                }),
                className,
            )}
            onClick={handleClick}
        >
            {status === "exited" || (
                <div
                    className={style({
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        translate: "-50% -50%",
                        zIndex: vars.zIndex.modal,
                        backgroundColor: vars.color.bg.layout,
                        borderRadius: vars.radius.block,
                    })}
                >
                    {children}
                </div>
            )}
        </div>
    );
};
