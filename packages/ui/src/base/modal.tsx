import { cx } from "@linaria/core";
import { style } from "@macaron-css/core";
import { noop, timeout } from "emnorst";
import { useEffect, useState } from "react";

export const Modal: React.FC<{
    open?: boolean;
    className?: string;
    children?: React.ReactNode;
    onClose?: () => void;
    transitionDuration?: number;
    variant?: "modal" | "popup";
}> = ({
    open,
    className,
    children,
    onClose,
    transitionDuration = 200,
    variant = "modal",
}) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        const ac = new AbortController();
        void timeout(transitionDuration, { signal: ac.signal }).then(() => {
            setIsMounted(!!open);
        }, noop);
        return () => {
            ac.abort();
        };
    }, [open, transitionDuration]);

    const handleClick: React.MouseEventHandler<HTMLDivElement> = e => {
        e.stopPropagation();
        if (e.target === e.currentTarget) {
            onClose?.();
        }
    };

    const status = open
        ? `enter${isMounted ? "ed" : "ing"}`
        : `exit${isMounted ? "ing" : "ed"}`;

    return (
        <div
            data-open={open}
            data-status={status}
            data-variant={variant}
            style={{ transitionDuration: `${transitionDuration}ms` }}
            className={cx(
                style({
                    zIndex: 9999,
                    transitionProperty: "opacity",
                    selectors: {
                        '&[data-variant="modal"]': {
                            position: "fixed",
                            top: 0,
                            right: 0,
                            bottom: 0,
                            left: 0,
                            backgroundColor: "#0008",
                        },
                        '&[data-variant="popup"]': {
                            position: "absolute",
                        },
                        '&[data-open="true"]': {
                            opacity: 1,
                        },
                        '&[data-open="false"]': {
                            pointerEvents: "none",
                            opacity: 0,
                        },
                    },
                }),
                className,
            )}
            onClick={handleClick}
        >
            {(open || isMounted) && children}
        </div>
    );
};
