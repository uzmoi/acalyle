import { noop, timeout } from "emnorst";
import { useEffect, useState } from "react";

export type UseTransitionStatusOptions = {
    show?: boolean;
    appear?: boolean;
    enter?: boolean;
    exit?: boolean;
    transitionDuration?: number;
};

export type TransitionStatus = "entering" | "entered" | "exiting" | "exited";

export const useTransitionStatus = ({
    show = false,
    appear = true,
    enter = true,
    exit = true,
    transitionDuration = 200,
}: UseTransitionStatusOptions): TransitionStatus => {
    const [isEntered, setIsEntered] = useState(show && !appear);

    const isInTransition = (show ? enter : exit) && show !== isEntered;
    useEffect(() => {
        if (isInTransition) {
            const ac = new AbortController();
            void timeout(transitionDuration, { signal: ac.signal }).then(() => {
                setIsEntered(show);
            }, noop);
            return () => {
                ac.abort();
            };
        } else {
            setIsEntered(show);
        }
    }, [isInTransition, show, transitionDuration]);

    return `${show ? "enter" : "exit"}${isInTransition ? "ing" : "ed"}`;
};
