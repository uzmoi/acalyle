export interface RegisterRebrand {}

// cspell:word Rebrandable

type RebrandableToScalar<T, Registry> = {
  [P in keyof Registry]: Registry[P] extends (a: infer A) => T ? A : never;
}[keyof Registry];

// TODO[@uzmoi/ut@>=0.1.4]: Brandがunionじゃなくなるので`T extends {} ? ... : ...`にする
type RebrandableTo<T, Registry> =
  | Exclude<T, {}>
  | ([NonNullable<T>] extends [readonly (infer U)[]] ?
      readonly RebrandableTo<U, Registry>[]
    : RebrandableToScalar<NonNullable<T>, Registry>);

type RebrandableFromScalar<T, Registry> = {
  [P in keyof Registry]: Registry[P] extends (a: T) => infer R ? R : never;
}[keyof Registry];

// TODO[@uzmoi/ut@>=0.1.4]: RebrandableTo と同じく
type Rebrandable<T, Registry> =
  // 一度inferすることで循環制約を回避
  [T] extends [infer T] ?
    | Exclude<T, {}>
    | ([NonNullable<T>] extends [readonly (infer U)[]] ?
        readonly Rebrandable<U, Registry>[]
      : RebrandableFromScalar<NonNullable<T>, Registry>)
  : never;

export interface Rebrand<Registry = RegisterRebrand> {
  <
    T extends RebrandableTo<NoInfer<U>, Registry>,
    U extends Rebrandable<NoInfer<T>, Registry>,
  >(
    value: T,
  ): U;
  <T>(value: RebrandableTo<NoInfer<T>, Registry>): T;
}

export const rebrand: Rebrand = <T>(value: unknown) => value as T;
