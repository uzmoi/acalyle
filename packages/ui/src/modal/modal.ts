import { Semaphore } from "@acalyle/util";
import { timeout } from "emnorst";
import { type ReadableAtom, atom } from "nanostores";

export const TRANSITION_DURATION = 200;

type ModalData<T, U> =
  | {
      show: true;
      data: T;
      resolve(result: U): void;
      reject(): void;
    }
  | { show: false; data: T };

export class Modal<out Data = void, out Result = void> {
  static create<T = void, R = void>(): Modal<T, R | undefined>;
  static create<T = void, R = void>(defaultValue: R): Modal<T, R>;
  // oxlint-disable-next-line explicit-function-return-type
  static create(defaultValue?: unknown) {
    return new Modal(defaultValue);
  }
  private constructor(private readonly _default: Result) {}
  private readonly _mutex = Semaphore.mutex();
  private readonly _$data = atom<ModalData<Data, Result> | undefined>();
  get data(): ReadableAtom<{ show: boolean; data: Data } | undefined> {
    return this._$data;
  }
  open(data: Data): Promise<Result> {
    return this._mutex.use(() => {
      return new Promise<Result>((resolve, reject) => {
        this._$data.set({ show: true, data, resolve, reject });
      });
    });
  }
  async close(result: Result = this._default): Promise<void> {
    const data = this._$data.get();
    if (!data?.show) return;

    data.resolve(result);
    this._$data.set({ show: false, data: data.data });
    await timeout(TRANSITION_DURATION);
    this._$data.set(undefined);
  }
}
