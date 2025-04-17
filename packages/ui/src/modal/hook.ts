import { timeout } from "emnorst";
import { useEffect, useState } from "react";
import type { Modal } from "./modal";

export type State<TData> =
  | { type: "enter"; data: TData }
  | { type: "exiting"; data: TData }
  | null;

export const useModalContainer = <TData, TResult>(
  modal: Modal<TData, TResult>,
): [State<TData>, "enter" | "exiting" | "exited"] => {
  const [state, setState] = useState<State<TData>>(null);

  useEffect(() => {
    return modal.registerContainer({
      open(data: TData) {
        setState({ type: "enter", data });
      },
      async close() {
        setState(state => state && { type: "exiting", data: state.data });
        // TRANSITION_DURATION
        await timeout(200);
        setState(null);
      },
    });
  }, [modal]);

  return [state, state?.type ?? "exited"];
};
