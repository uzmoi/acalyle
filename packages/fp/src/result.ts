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
  isOk(): this is ResultOk<A> {
    return this.ok;
  }
  isErr(): this is ResultErr<E> {
    return !this.ok;
  }
  getOk(): Option<A> {
    return this.isOk() ? Some(this.value) : None;
  }
  getErr(): Option<E> {
    return this.isErr() ? Some(this.value) : None;
  }
  getUnion(): A | E {
    return this.value;
  }
  getOrThrow(): A {
    if (this.isOk()) {
      return this.value;
    }
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw this.value;
  }
  match<B, C>(whenOk: (value: A) => B, whenErr: (value: E) => C): B | C {
    return this.isOk() ? whenOk(this.value) : whenErr(this.value as E);
  }
  map<B>(fn: (value: A) => B): Result<B, E> {
    return this.isOk() ?
        Ok(fn(this.value))
      : (this as ResultBase<unknown, E> as Result<never, E>);
  }
  flatMap<B>(fn: (value: A) => Result<B, E>): Result<B, E> {
    return this.isOk() ?
        fn(this.value)
      : (this as ResultBase<unknown, E> as Result<never, E>);
  }
  mapE<B>(fn: (value: E) => B): Result<A, B> {
    return this.isErr() ?
        Err(fn(this.value))
      : (this as ResultBase<A, unknown> as Result<A, never>);
  }
  flatMapE<B>(fn: (value: E) => Result<A, B>): Result<A, B> {
    return this.isErr() ?
        fn(this.value)
      : (this as ResultBase<A, unknown> as Result<A, never>);
  }
}

export const { Ok, Err } = ResultBase;
