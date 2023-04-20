import { style } from "@macaron-css/core";
import { cx } from "./cx";
import { useTransitionStatus } from "./use-transition-status";

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
    const status = useTransitionStatus({ show: open, transitionDuration });

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
            {status === "exited" || children}
        </div>
    );
};
