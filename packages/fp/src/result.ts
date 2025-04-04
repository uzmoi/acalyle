import { None, type Option, Some } from "./option";

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

  getOk(this: Result<A, E>): Option<A> {
    return this.ok ? Some(this.value) : None;
  }
  getErr(this: Result<A, E>): Option<E> {
    return this.ok ? None : Some(this.value);
  }
  unwrap(this: Result<A, E>): A {
    if (this.ok) return this.value;
    throw new TypeError("Called unwrap on `Err`", { cause: this.value });
  }
  match<B, C>(
    this: Result<A, E>,
    ok: (value: A) => B,
    err: (value: E) => C,
  ): B | C {
    return this.ok ? ok(this.value) : err(this.value);
  }
  map<B>(this: Result<A, E>, fn: (value: A) => B): Result<B, E> {
    return this.ok ? Ok(fn(this.value)) : (this as Result<never, E>);
  }
  flatMap<B>(this: Result<A, E>, fn: (value: A) => Result<B, E>): Result<B, E> {
    return this.ok ? fn(this.value) : (this as Result<never, E>);
  }
  mapE<B>(this: Result<A, E>, fn: (value: E) => B): Result<A, B> {
    return this.ok ? (this as Result<A, never>) : Err(fn(this.value));
  }
  flatMapE<B>(
    this: Result<A, E>,
    fn: (value: E) => Result<A, B>,
  ): Result<A, B> {
    return this.ok ? (this as Result<A, never>) : fn(this.value);
  }
}

export const Result = ResultBase;

export const Ok = <A>(value: A): ResultOk<A, never> =>
  // @ts-expect-error: ignore
  new ResultBase(true, value) as Result<A, never>;

export const Err = <E>(error: E): ResultErr<never, E> =>
  // @ts-expect-error: ignore
  new ResultBase(false, error) as Result<never, E>;
