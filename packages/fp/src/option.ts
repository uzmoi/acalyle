import { identify } from "emnorst";

const none = /* #__PURE__ */ Symbol("Option.None");

type ValueOrGetter<T> = Exclude<T, () => unknown> | (() => T);

export class Option<out A> {
  static None: Option<never> = new Option<never>(none);
  static Some<A>(this: void, value: A): Option<A> {
    return new Option(value);
  }
  static from<A>(
    this: void,
    value: A | null | undefined,
  ): Option<NonNullable<A>> {
    return new Option(value ?? none);
  }
  private constructor(private readonly _value: A | typeof none) {}
  isNone(): this is Option<never> {
    return this._value === none;
  }
  isSome(): this is Option<A> {
    return this._value !== none;
  }
  unwrapOrThrow(): A {
    if (this._value === none) {
      throw new TypeError("None has no value.");
    }
    return this._value;
  }
  unwrapOrElse<B>(value: ValueOrGetter<B>): A | B {
    return (
      this._value === none ?
        typeof value === "function" ?
          (value as () => B)()
        : value
      : this._value
    );
  }
  orElse<B>(option: ValueOrGetter<Option<B>>): Option<A | B> {
    return (
      this._value === none ?
        typeof option === "function" ?
          option()
        : option
      : this
    );
  }
  map<B>(fn: (value: A) => B): Option<B> {
    return this._value === none ? None : Some(fn(this._value));
  }
  flatMap<B>(fn: (value: A) => Option<B>): Option<B> {
    return this._value === none ? None : fn(this._value);
  }
  flat<B>(this: Option<Option<B>>): Option<B> {
    return this.flatMap(identify);
  }
}

export const { Some, None } = Option;
