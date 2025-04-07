import { Semaphore } from "@acalyle/util";
import { timeout } from "emnorst";
import { type ReadableAtom, atom } from "nanostores";
import type { TransitionStatus } from "../base/use-transition-status";

export const TRANSITION_DURATION = 200;

type ModalData<out T, out U> = {
  data: T;
  resolve(result: U): void;
  reject(): void;
};

export class Modal<out Data = void, out Result = void> {
  static create<T = void, R = void>(): Modal<T, R | undefined>;
  static create<T = void, R = void>(defaultValue: R): Modal<T, R>;
  // oxlint-disable-next-line explicit-function-return-type
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
  private async _transition(name: "enter" | "exit"): Promise<void> {
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
