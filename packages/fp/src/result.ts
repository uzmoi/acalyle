import { None, type Option, Some } from "./option";

interface ResultOk<out A> extends ResultBase<A, never> {
  readonly ok: true;
  readonly value: A;
}

interface ResultErr<out E> extends ResultBase<never, E> {
  readonly ok: false;
  readonly value: E;
}

export type Result<A, E> = ResultOk<A> | ResultErr<E>;

export class ResultBase<out A, out E> {
  static try<A>(runner: () => A): Result<A, unknown> {
    try {
      return Ok(runner());
    } catch (error) {
      return Err(error);
    }
  }
  static Err<E>(this: void, error: E): ResultErr<E> {
    return new ResultBase(false, error) as ResultErr<E>;
  }
  static Ok<A>(this: void, value: A): ResultOk<A> {
    return new ResultBase(true, value) as ResultOk<A>;
  }
  private constructor(ok: true, value: A);
  private constructor(ok: false, value: E);
  private constructor(
    readonly ok: boolean,
    readonly value: A | E,
  ) {}
  getOk(this: Result<A, E>): Option<A> {
    return this.ok ? Some(this.value) : None;
  }
  getErr(this: Result<A, E>): Option<E> {
    return this.ok ? None : Some(this.value);
  }
  unwrapOrThrow(this: Result<A, E>): A {
    if (this.ok) return this.value;
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw this.value;
  }
  match<B, C>(
    this: Result<A, E>,
    ok: (value: A) => B,
    err: (value: E) => C,
  ): B | C {
    return this.ok ? ok(this.value) : err(this.value);
  }
  map<B>(this: Result<A, E>, fn: (value: A) => B): Result<B, E> {
    return this.ok ? Ok(fn(this.value)) : this;
  }
  flatMap<B>(this: Result<A, E>, fn: (value: A) => Result<B, E>): Result<B, E> {
    return this.ok ? fn(this.value) : this;
  }
  mapE<B>(this: Result<A, E>, fn: (value: E) => B): Result<A, B> {
    return this.ok ? this : Err(fn(this.value));
  }
  flatMapE<B>(
    this: Result<A, E>,
    fn: (value: E) => Result<A, B>,
  ): Result<A, B> {
    return this.ok ? this : fn(this.value);
  }
}

export const { Ok, Err } = ResultBase;
