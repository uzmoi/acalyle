import { useCallback, useEffect, useId } from "react";
import { WindowEvent } from "./window-event";

let grabbing: { id: string; value: unknown } | null = null;

export const useGrab = <T>(
    move: (e: MouseEvent, value: T) => void,
    deps?: readonly unknown[],
) => {
    const id = useId();

    useEffect(() => {
        return WindowEvent.on("mousemove", e => {
            if (grabbing?.id === id) {
                move(e, grabbing.value as T);
            }
        });
    }, deps);

    const startGrab = useCallback(
        (init: T, onEnd?: (e: MouseEvent, value: T) => void) => {
            if (grabbing == null) {
                grabbing = { id, value: init };
                const off = WindowEvent.on("mouseup", e => {
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    const value = grabbing!.value as T;
                    grabbing = null;
                    off();
                    onEnd?.(e, value);
                });
            }
        },
        [],
    );

    return startGrab;
};
