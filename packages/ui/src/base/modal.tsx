import { style } from "@macaron-css/core";
import { useStore } from "@nanostores/react";
import { timeout } from "emnorst";
import { atom, onMount } from "nanostores";
import { vars } from "../theme";
import { cx } from "./cx";
import type { TransitionStatus } from "./use-transition-status";

type ModalData<out T> = {
    default: T;
    render: (close: (result?: T) => void) => React.ReactNode;
};

const ModalStore = atom<{
    contents: React.ReactNode;
    close: () => void;
} | null>(null);

onMount(ModalStore, () => {
    const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
            ModalStore.get()?.close();
        }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
        window.addEventListener("keydown", onKeyDown);
    };
});

const ModalStatusStore = atom<TransitionStatus>("exited");

export const openModal = <T,>(entry: ModalData<T>): Promise<T> => {
    return new Promise(resolve => {
        let open = true;
        const close = (result = entry.default) => {
            if (!open) return;
            open = false;
            resolve(result);
            ModalStatusStore.set("exiting");
            void timeout(transitionDuration).then(() => {
                ModalStore.set(null);
                ModalStatusStore.set("exited");
            });
        };
        ModalStore.set({
            contents: entry.render(close),
            close,
        });
        ModalStatusStore.set("entering");
        void timeout(transitionDuration).then(() => {
            ModalStatusStore.set("entered");
        });
    });
};

const transitionDuration = 200;

export const ModalContainer: React.FC<{
    className?: string;
}> = ({ className }) => {
    const modal = useStore(ModalStore);
    const status = useStore(ModalStatusStore);

    const onClickBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            modal?.close();
        }
    };

    return (
        <div
            data-open={status.startsWith("enter")}
            data-status={status}
            className={cx(
                style({
                    position: "fixed",
                    inset: 0,
                    zIndex: vars.zIndex.modal,
                    backgroundColor: "#0008",
                    backdropFilter: "blur(0.125em)",
                    transition: `opacity ${transitionDuration}ms`,
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
            onClick={onClickBackdrop}
        >
            {status === "exited" || (
                <div
                    className={style({
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        translate: "-50% -50%",
                        backgroundColor: vars.color.bg.layout,
                        borderRadius: vars.radius.block,
                        boxShadow: "0 0 2em #111",
                    })}
                >
                    {modal && modal.contents}
                </div>
            )}
        </div>
    );
};
