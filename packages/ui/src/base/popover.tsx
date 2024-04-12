import { style } from "@macaron-css/core";
import { useStore } from "@nanostores/react";
import { timeout } from "emnorst";
import { atom, onMount } from "nanostores";
import { createContext, useCallback, useContext, useId } from "react";
import { Button } from "../control/button";
import { vars } from "../theme/theme";
import { cx } from "./cx";
import { useTransitionStatus } from "./use-transition-status";

const PopoverStore = /* #__PURE__ */ atom<string | null>(null);

export const closePopover = () => {
    PopoverStore.set(null);
};

// eslint-disable-next-line pure-module/pure-module
onMount(PopoverStore, () => {
    window.addEventListener("click", closePopover);
    return () => {
        window.removeEventListener("click", closePopover);
    };
});

const PopoverIdContext = /* #__PURE__ */ createContext<string | undefined>(
    undefined,
);

export const Popover: React.FC<React.ComponentPropsWithoutRef<"div">> & {
    Button: typeof PopoverButton;
    Content: typeof PopoverContent;
} = ({ className, children, ...restProps }) => {
    const popoverId = useId();

    return (
        <div
            {...restProps}
            className={cx(style({ position: "relative" }), className)}
        >
            <PopoverIdContext.Provider value={popoverId}>
                {children}
            </PopoverIdContext.Provider>
        </div>
    );
};

const PopoverButton: React.FC<
    Omit<
        React.ComponentPropsWithoutRef<typeof Button>,
        "aria-expanded" | "aria-controls"
    >
> = ({ onClick, children, ...restProps }) => {
    const popoverId = useContext(PopoverIdContext);
    const openedPopoverId = useStore(PopoverStore);
    const isOpen = popoverId === openedPopoverId;

    const actualOnClick = useCallback(
        (e: React.MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            onClick?.(e);
            PopoverStore.set(
                PopoverStore.get() === popoverId ? null : popoverId ?? null,
            );
        },
        [onClick, popoverId],
    );

    return (
        <Button
            {...restProps}
            aria-expanded={isOpen}
            aria-controls={popoverId}
            onClick={actualOnClick}
        >
            {children}
        </Button>
    );
};

// eslint-disable-next-line pure-module/pure-module
Popover.Button = PopoverButton;
if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line pure-module/pure-module
    Popover.Button.displayName = "Popover.Button";
}

const TRANSITION_DURATION = 200;
const transition = () => timeout(TRANSITION_DURATION);

const PopoverContent: React.FC<
    {
        closeOnClick?: boolean;
    } & Omit<React.ComponentPropsWithoutRef<"div">, "id">
> = ({ closeOnClick, onClick, className, children, ...restProps }) => {
    const popoverId = useContext(PopoverIdContext);
    const openedPopoverId = useStore(PopoverStore);
    const isOpen = popoverId === openedPopoverId;
    const status = useTransitionStatus({ show: isOpen, transition });

    const actualOnClick =
        closeOnClick ? onClick : (
            (e: React.MouseEvent<HTMLDivElement>) => {
                e.stopPropagation();
                onClick?.(e);
            }
        );

    return (
        <div
            {...restProps}
            id={popoverId}
            data-open={isOpen}
            data-status={status}
            className={cx(
                style({
                    position: "absolute",
                    zIndex: vars.zIndex.popover,
                    backgroundColor: vars.color.bg.block,
                    borderRadius: vars.radius.block,
                    boxShadow: "0 0 2em #111",
                    transition: `opacity ${TRANSITION_DURATION}ms`,
                    selectors: {
                        '&[data-open="false"]': { opacity: 0 },
                        '&[data-status="exited"]': { visibility: "hidden" },
                    },
                }),
                className,
            )}
            onClick={actualOnClick}
        >
            {status === "exited" || children}
        </div>
    );
};

// eslint-disable-next-line pure-module/pure-module
Popover.Content = PopoverContent;
if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line pure-module/pure-module
    Popover.Content.displayName = "Popover.Content";
}
