import { atom, keepMount } from "nanostores";
import { expect, test, vi } from "vitest";
import { derived, pure } from "~/lib/derived";

test("derive", () => {
    const store = derived(() => pure(1));
    expect(store.get()).toBe(1);
});

test("subscribe", () => {
    const store = atom(1);
    const derivedStore = derived(() => store);

    store.set(2);
    expect(derivedStore.get()).toBe(2);
});

test("unsubscribe", () => {
    const store1 = atom(true);
    const store2 = atom(1);
    const derivedStore = derived(get => (get(store1) ? store2 : pure(-1)));

    keepMount(store1);
    store1.set(false);

    const fn = vi.fn();
    derivedStore.listen(fn);
    store2.set(2);

    expect(fn).not.toBeCalled();
});
