import { style } from "@macaron-css/core";
import { useStore } from "@nanostores/react";
import { timeout } from "emnorst";
import { atom, onMount } from "nanostores";
import { createContext, useCallback, useContext, useId } from "react";
import { Button } from "../control/button";
import { vars } from "../theme/theme";
import { cx } from "./cx";
import { useTransitionStatus } from "./use-transition-status";

const PopoverStore = atom<string | null>(null);

export const closePopover = () => {
    PopoverStore.set(null);
};

onMount(PopoverStore, () => {
    window.addEventListener("click", closePopover);
    return () => {
        window.removeEventListener("click", closePopover);
    };
});

const PopoverIdContext = createContext<string | undefined>(undefined);

export const Popover: React.FC<React.ComponentPropsWithoutRef<"div">> & {
    Button: typeof PopoverButton;
    Content: typeof PopoverContent;
} = ({ className, children, ...restProps }) => {
    const id = useId();

    return (
        <div
            {...restProps}
            className={cx(
                style({
                    position: "relative",
                }),
                className,
            )}
        >
            <PopoverIdContext.Provider value={id}>
                {children}
            </PopoverIdContext.Provider>
        </div>
    );
};

const PopoverButton: React.FC<
    React.ComponentPropsWithoutRef<typeof Button>
> = ({ onClick, children, ...restProps }) => {
    const popoverId = useContext(PopoverIdContext);
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
        <Button {...restProps} onClick={actualOnClick}>
            {children}
        </Button>
    );
};

Popover.Button = PopoverButton;
if (process.env.NODE_ENV === "development") {
    Popover.Button.displayName = "Popover.Button";
}

const transitionDuration = 200;
const transition = () => timeout(transitionDuration);

const PopoverContent: React.FC<
    {
        closeOnClick?: boolean;
    } & React.ComponentPropsWithoutRef<"div">
> = ({ closeOnClick, onClick, className, children, ...restProps }) => {
    const popoverId = useContext(PopoverIdContext);
    const openedPopoverId = useStore(PopoverStore);
    const isOpen = popoverId === openedPopoverId;
    const status = useTransitionStatus({ show: isOpen, transition });

    const actualOnClick = closeOnClick
        ? onClick
        : (e: React.MouseEvent<HTMLDivElement>) => {
              e.stopPropagation();
              onClick?.(e);
          };

    return (
        <div
            {...restProps}
            data-open={isOpen}
            data-status={status}
            className={cx(
                style({
                    position: "absolute",
                    zIndex: 9999,
                    backgroundColor: vars.color.bg3,
                    borderRadius: "0.25em",
                    boxShadow: "0 0 2em #111",
                    transition: `opacity ${transitionDuration}ms`,
                    selectors: {
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
            onClick={actualOnClick}
        >
            {status === "exited" || children}
        </div>
    );
};

Popover.Content = PopoverContent;
if (process.env.NODE_ENV === "development") {
    Popover.Content.displayName = "Popover.Content";
}
