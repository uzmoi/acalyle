import { Semaphore } from "@acalyle/util";
import { style } from "@macaron-css/core";
import { useStore } from "@nanostores/react";
import { timeout } from "emnorst";
import { type ReadableAtom, atom } from "nanostores";
import { useEffect } from "react";
import { vars } from "../theme";
import { cx } from "./cx";
import { center } from "./style-utilities";
import type { TransitionStatus } from "./use-transition-status";

const TRANSITION_DURATION = 200;

type ModalData<out T, out U> = {
    data: T;
    resolve(result: U): void;
    reject(): void;
};

export class Modal<out Data = void, out Result = void> {
    static create<T = void, R = void>(): Modal<T, R | undefined>;
    static create<T = void, R = void>(defaultValue: R): Modal<T, R>;
    static create(defaultValue?: unknown) {
        return new Modal(defaultValue);
    }
    private constructor(private readonly _default: Result) {}
    private readonly _mutex = Semaphore.mutex();
    private readonly _status = atom<TransitionStatus>("exited");
    private readonly _$data = atom<ModalData<Data, Result> | undefined>();
    get status(): ReadableAtom<TransitionStatus> {
        return this._status;
    }
    get data(): ReadableAtom<{ data: Data } | undefined> {
        return this._$data;
    }
    private async _transition(name: "enter" | "exit") {
        if (this._status.get().startsWith(name)) return;
        this._status.set(`${name}ing`);
        await timeout(TRANSITION_DURATION);
        // AbortControllerを使わずにstatusで判断すると、
        // openしてからTRANSITION_DURATION ms以内にclose -> open
        // もしくは
        // closeしてからTRANSITION_DURATION ms以内にopen -> close
        // したときにexitedになるのが早くなるが、影響もほぼないので放置
        if (this._status.get() === `${name}ing`) {
            this._status.set(`${name}ed`);
        }
    }
    open(data: Data): Promise<Result> {
        return this._mutex.use(() => {
            const result = new Promise<Result>((resolve, reject) => {
                this._$data.set({ data, resolve, reject });
            });
            void this._transition("enter");
            return result;
        });
    }
    async close(result: Result = this._default): Promise<void> {
        this._$data.get()?.resolve(result);
        await this._transition("exit");
        // _transitionと同じく
        if (this._status.get() === "exiting") {
            this._$data.set(undefined);
        }
    }
}

export type ModalSize = "content" | "max";

export const ModalContainer: <T>(props: {
    modal: Modal<T, unknown>;
    render: (data: T) => React.ReactNode;
    size?: ModalSize;
    className?: string;
    onClickBackdrop?: React.MouseEventHandler<HTMLDivElement>;
}) => React.ReactElement | null = ({
    modal,
    render,
    size,
    className,
    onClickBackdrop,
}) => {
    const handleClickBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target !== e.currentTarget) return;
        onClickBackdrop?.(e);
        if (e.defaultPrevented) return;
        void modal.close();
    };

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                void modal.close();
            }
        };
        window.addEventListener("keydown", onKeyDown);
        return () => {
            window.addEventListener("keydown", onKeyDown);
        };
    }, [modal]);

    const data = useStore(modal.data);
    const status = useStore(modal.status);

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
                    backdropFilter: "blur(0.0625em)",
                    transition: `opacity ${TRANSITION_DURATION}ms`,
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
            onClick={handleClickBackdrop}
        >
            {data ?
                <div
                    className={cx(
                        style({
                            ...center(),
                            maxWidth: "min(calc(100vw - min(8em, 20%)), 72em)",
                            maxHeight: "calc(100dvh - 4em)",
                            backgroundColor: vars.color.bg.layout,
                            borderRadius: vars.radius.layout,
                            boxShadow: "0 0 2em #111",
                        }),
                        size === "max" &&
                            style(
                                { width: "100%", height: "100%" },
                                "modal--size__max",
                            ),
                    )}
                >
                    {render(data.data)}
                </div>
            :   null}
        </div>
    );
};
