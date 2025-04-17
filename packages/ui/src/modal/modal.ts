interface CreateModal {
  <T = void, R = void>(): Modal<T, R | undefined>;
  <T = void, R = void>(defaultValue: R): Modal<T, R>;
}

export const createModal: CreateModal = (defaultValue?) =>
  new Modal(defaultValue);

interface Container<TData> {
  open(data: TData): void;
  close(): Promise<void>;
}

export class Modal<out TData = void, out TResult = void> {
  constructor(private readonly _default: TResult) {}

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

  private _queue: {
    data: TData;
    resolve(this: void, result: TResult): void;
  }[] = [];

  private _resolve:
    | { bivarianceHack(result: TResult): void }["bivarianceHack"]
    | undefined;

  open(data: TData): Promise<TResult> {
    return new Promise<TResult>(resolve => {
      if (this._container == null) {
        throw new Error("containerが登録されていません。");
      }

      if (this._resolve == null) {
        this._container.open(data);
        this._resolve = resolve;
      } else {
        this._queue.push({ data, resolve });
      }
    });
  }
  async close(result: TResult = this._default): Promise<void> {
    if (this._container == null) {
      throw new Error("containerが登録されていません。");
    }

    if (this._resolve == null) return;

    this._resolve(result);

    if (this._queue.length === 0) {
      await this._container.close();
    }

    if (this._queue.length > 0) {
      const { data, resolve } = this._queue.shift()!;

      this._container.open(data);
      this._resolve = resolve;
    } else {
      this._resolve = undefined;
    }
  }
}
