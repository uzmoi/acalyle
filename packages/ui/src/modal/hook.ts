import { timeout } from "emnorst";
import { useEffect, useState } from "react";
import type { Modal } from "./modal";

export type State<TData> =
  | { type: "open"; data: TData }
  | { type: "closing"; data: TData }
  | null;

export const useModalContainer = <TData, TResult>(
  modal: Modal<TData, TResult>,
): [State<TData>, "open" | "closing" | "closed"] => {
  const [state, setState] = useState<State<TData>>(null);

  useEffect(() => {
    return modal.registerContainer({
      open(data: TData) {
        setState({ type: "open", data });
      },
      async close() {
        setState(state => state && { type: "closing", data: state.data });
        // TRANSITION_DURATION
        await timeout(200);
        setState(null);
      },
    });
  }, [modal]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent): void => {
      if (e.key === "Escape") {
        void modal.close();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [modal]);

  return [state, state?.type ?? "closed"];
};
