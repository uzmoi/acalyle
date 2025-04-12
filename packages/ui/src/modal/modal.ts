import { Semaphore } from "@acalyle/util";
import { type ReadableAtom, atom } from "nanostores";

type ModalData<TData, TResult> =
  | {
      show: true;
      data: TData;
      resolve(result: TResult): void;
    }
  | {
      show: false;
      data: TData;
      resolve: () => void;
    };

export class Modal<out TData = void, out TResult = void> {
  static create<T = void, R = void>(): Modal<T, R | undefined>;
  static create<T = void, R = void>(defaultValue: R): Modal<T, R>;
  // oxlint-disable-next-line explicit-function-return-type
  static create(defaultValue?: unknown) {
    return new Modal(defaultValue);
  }
  private constructor(private readonly _default: TResult) {}
  private readonly _mutex = Semaphore.mutex();
  private readonly _$data = atom<ModalData<TData, TResult> | undefined>();
  get data(): ReadableAtom<{ show: boolean; data: TData } | undefined> {
    return this._$data;
  }
  open(data: TData): Promise<TResult> {
    return this._mutex.use(() => {
      return new Promise<TResult>(resolve => {
        this._$data.set({ show: true, data, resolve });
      });
    });
  }
  async close(result: TResult = this._default): Promise<void> {
    const data = this._$data.get();
    if (!data?.show) return;

    data.resolve(result);
    return new Promise(resolve => {
      this._$data.set({ show: false, data: data.data, resolve });
    });
  }
  onExited = (): void => {
    const data = this._$data.get();
    if (data == null || data.show) return;

    data.resolve();
    this._$data.set(undefined);
  };
}
