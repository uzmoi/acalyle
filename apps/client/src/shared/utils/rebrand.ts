export interface RegisterRebrand {}

// cspell:word Rebrandable

// Union の状態で NoInfer が付くと型が分配されなくなるようなので、末端の必要な部分で NoInfer する。

type RebrandableToScalar<T, Registry> = {
  [P in keyof Registry]: Registry[P] extends (a: infer A) => T ? A : never;
}[keyof Registry];

type RebrandableTo<T, Registry> =
  T extends {} ?
    T extends readonly (infer U)[] ?
      readonly RebrandableTo<U, Registry>[]
    : RebrandableToScalar<T, Registry>
  : NoInfer<T>;

type RebrandableFromScalar<T, Registry> = {
  [P in keyof Registry]: Registry[P] extends (a: T) => infer R ? R : never;
}[keyof Registry];

type Rebrandable<T, Registry> =
  // 一度inferすることで循環制約を回避（NoInfer の効果もあるっぽい？）
  [T] extends [infer T] ?
    T extends {} ?
      T extends readonly (infer U)[] ?
        readonly Rebrandable<U, Registry>[]
      : RebrandableFromScalar<T, Registry>
    : T
  : never;

export interface Rebrand<Registry = RegisterRebrand> {
  <T extends RebrandableTo<U, Registry>, U extends Rebrandable<T, Registry>>(
    value: T,
  ): U;
  <T>(value: RebrandableTo<T, Registry>): T;
}

export const rebrand: Rebrand = <T>(value: unknown) => value as T;
