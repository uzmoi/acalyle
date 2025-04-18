import { timeout } from "emnorst";
import { useDebugValue, useEffect, useState } from "react";
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
      async open(data: TData) {
        // XXX: なんでかわからんが同期的にsetStateすると無視される場合があり、その対策。
        await Promise.resolve();

        setState({ type: "open", data });
      },
      async close() {
        // open直後にcloseすると順番が入れ替わるので同じく待つ。
        // あと、closeの側にも同じ問題があるかもしれないので。
        await Promise.resolve();

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

  useDebugValue(state);

  return [state, state?.type ?? "closed"];
};
