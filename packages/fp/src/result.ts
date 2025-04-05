interface ResultOk<out A, out E> extends ResultBase<A, E> {
  readonly ok: true;
  readonly value: A;
}

interface ResultErr<out A, out E> extends ResultBase<A, E> {
  readonly ok: false;
  readonly value: E;
}

export type Result<A, E> = ResultOk<A, E> | ResultErr<A, E>;

class ResultBase<out A, out E> {
  static {
    Object.freeze(this.prototype);
  }

  static try<A>(runner: () => A): Result<A, unknown> {
    try {
      return Ok(runner());
    } catch (error) {
      return Err(error);
    }
  }

  private constructor(
    readonly ok: boolean,
    readonly value: A | E,
  ) {
    Object.freeze(this);
  }

  toString(): string {
    const value = String(this.value);
    return this.ok ? `Ok(${value})` : `Err(${value})`;
  }

  unwrap(this: Result<A, E>): A {
    if (this.ok) return this.value;
    throw new TypeError("Called unwrap on `Err`", { cause: this.value });
  }
  unwrapOr<B>(this: Result<A, E>, value: B): A | B {
    return this.ok ? this.value : value;
  }
  map<B>(this: Result<A, E>, fn: (value: A) => B): Result<B, E> {
    return this.ok ? Ok(fn(this.value)) : (this as Result<never, E>);
  }
  mapOr<B, C>(this: Result<A, E>, value: B, fn: (value: A) => C): B | C {
    return this.ok ? fn(this.value) : value;
  }
  flatMap<B, F>(
    this: Result<A, E>,
    fn: (value: A) => Result<B, F>,
  ): Result<B, E | F> {
    return this.ok ? fn(this.value) : (this as Result<never, E>);
  }
  mapErr<F>(this: Result<A, E>, fn: (value: E) => F): Result<A, F> {
    return this.ok ? (this as Result<A, never>) : Err(fn(this.value));
  }
}

export const Result = ResultBase;

export const Ok = <A>(value: A): ResultOk<A, never> =>
  // @ts-expect-error: ignore
  new ResultBase(true, value) as Result<A, never>;

export const Err = <E>(error: E): ResultErr<never, E> =>
  // @ts-expect-error: ignore
  new ResultBase(false, error) as Result<never, E>;
