import { Semaphore } from "@acalyle/util";

interface Container<TData> {
  open(data: TData): void;
  close(): Promise<void>;
}

export class Modal<out TData = void, out TResult = void> {
  static create<T = void, R = void>(): Modal<T, R | undefined>;
  static create<T = void, R = void>(defaultValue: R): Modal<T, R>;
  // oxlint-disable-next-line explicit-function-return-type
  static create(defaultValue?: unknown) {
    return new Modal(defaultValue);
  }
  private constructor(private readonly _default: TResult) {}
  private readonly _mutex = Semaphore.mutex();

  private _container: Container<TData> | undefined;
  /** @internal */
  registerContainer(container: Container<TData>): () => void {
    if (this._container != null) {
      throw new Error("複数のcontainerを登録できません。");
    }
    this._container = container;
    return () => {
      this._container = undefined;
    };
  }

  private _resolve:
    | { bivarianceHack(result: TResult): void }["bivarianceHack"]
    | undefined;

  open(data: TData): Promise<TResult> {
    return this._mutex.use(() => {
      if (this._container == null) {
        throw new Error("containerが登録されていません。");
      }

      this._container.open(data);

      return new Promise<TResult>(resolve => {
        this._resolve = resolve;
      });
    });
  }
  async close(result: TResult = this._default): Promise<void> {
    if (this._container == null) {
      throw new Error("containerが登録されていません。");
    }

    if (this._resolve == null) return;

    this._resolve(result);
    this._resolve = undefined;

    await this._container.close();
  }
}
