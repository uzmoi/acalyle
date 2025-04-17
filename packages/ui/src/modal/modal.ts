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

  private _current:
    | { open: true; resolve(result: TResult): void }
    | { open: false }
    | undefined;

  open(data: TData): Promise<TResult> {
    return new Promise<TResult>(resolve => {
      if (this._container == null) {
        throw new Error("containerが登録されていません。");
      }

      if (this._current == null) {
        this._container.open(data);
        this._current = { open: true, resolve };
      } else {
        this._queue.push({ data, resolve });
      }
    });
  }
  async close(result: TResult = this._default): Promise<void> {
    if (this._container == null) {
      throw new Error("containerが登録されていません。");
    }

    if (!this._current?.open) return;

    this._current.resolve(result);

    if (this._queue.length === 0) {
      this._current = { open: false };
      await this._container.close();
    }

    if (this._queue.length > 0) {
      const { data, resolve } = this._queue.shift()!;

      this._container.open(data);
      this._current = { open: true, resolve };
    } else {
      this._current = undefined;
    }
  }
}
