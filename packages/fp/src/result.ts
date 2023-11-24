import { Option } from "./option";

type PerformResult<E> = <A>(x: Result<A, E>) => A;
type DoResultRunner<B, E> = (perform: PerformResult<E>) => Result<B, E>;

export class Result<out A, out E> {
    static do<A, E>(runner: DoResultRunner<A, E>): Result<A, E> {
        // eslint-disable-next-line unicorn/consistent-function-scoping
        const perform: PerformResult<unknown> = result => {
            // getOrThrowのthrowするのをresultにしただけ
            if (result.isOk()) {
                return result._value;
            }
            throw result;
        };
        try {
            return runner(perform);
        } catch (error) {
            if (error instanceof Result && error.isErr()) {
                return error as Result<never, E>;
            }
            throw error;
        }
    }
    static try<A>(runner: () => A): Result<A, unknown> {
        try {
            return Result.ok(runner());
        } catch (error) {
            return Result.err(error);
        }
    }
    static err<E>(this: void, error: E): Result<never, E> {
        return new Result(false, error);
    }
    static ok<A>(this: void, value: A): Result<A, never> {
        return new Result(true, value);
    }
    private constructor(ok: true, value: A);
    private constructor(ok: false, value: E);
    private constructor(
        private readonly _ok: boolean,
        private readonly _value: A | E,
    ) {}
    isOk(): this is Result<A, never> {
        return this._ok;
    }
    isErr(): this is Result<never, E> {
        return !this._ok;
    }
    getOk(): Option<A> {
        return this.isOk() ? Option.some(this._value) : Option.none();
    }
    getErr(): Option<E> {
        return this.isErr() ? Option.some(this._value) : Option.none();
    }
    getUnion(): A | E {
        return this._value;
    }
    getOrThrow(): A {
        if (this.isOk()) {
            return this._value;
        }
        throw this._value;
    }
    match<B, C>(whenOk: (value: A) => B, whenErr: (value: E) => C): B | C {
        return this.isOk() ? whenOk(this._value) : whenErr(this._value as E);
    }
    map<B>(fn: (value: A) => B): Result<B, E> {
        return this.isOk() ?
                Result.ok(fn(this._value))
            :   (this as Result<unknown, E> as Result<never, E>);
    }
    flatMap<B>(fn: (value: A) => Result<B, E>): Result<B, E> {
        return this.isOk() ?
                fn(this._value)
            :   (this as Result<unknown, E> as Result<never, E>);
    }
    mapE<B>(fn: (value: E) => B): Result<A, B> {
        return this.isErr() ?
                Result.err(fn(this._value))
            :   (this as Result<A, unknown> as Result<A, never>);
    }
    flatMapE<B>(fn: (value: E) => Result<A, B>): Result<A, B> {
        return this.isErr() ?
                fn(this._value)
            :   (this as Result<A, unknown> as Result<A, never>);
    }
}
