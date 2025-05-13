import { useEffect, useState } from "react";

export type UseTransitionStatusOptions = {
  show?: boolean;
  appear?: boolean;
  enter?: boolean;
  exit?: boolean;
  transition: (signal: AbortSignal) => PromiseLike<void>;
  onEntered?: () => void;
  onExited?: () => void;
};

export type TransitionStatus = "entering" | "entered" | "exiting" | "exited";

export const useTransitionStatus = ({
  show = false,
  appear = true,
  enter = true,
  exit = true,
  transition,
  onEntered,
  onExited,
}: UseTransitionStatusOptions): TransitionStatus => {
  const [isEntered, setIsEntered] = useState(show && !appear);

  const isInTransition = (show ? enter : exit) && show !== isEntered;
  useEffect(() => {
    if (isInTransition) {
      const ac = new AbortController();
      const onTransitionEnd = (): void => {
        if (!ac.signal.aborted) {
          ac.abort();
          setIsEntered(show);
          (show ? onEntered : onExited)?.();
        }
      };
      void transition(ac.signal).then(onTransitionEnd, onTransitionEnd);
      return () => {
        ac.abort();
      };
    } else {
      setIsEntered(show);
      (show ? onEntered : onExited)?.();
    }
  }, [isInTransition, show, transition, onEntered, onExited]);

  return `${show ? "enter" : "exit"}${isInTransition ? "ing" : "ed"}`;
};
