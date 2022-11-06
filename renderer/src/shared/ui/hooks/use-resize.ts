import { useEffect, useRef } from "react";

const els = new WeakMap<Element, (entry: ResizeObserverEntry) => void>();
const resizeObserver = new ResizeObserver(entries => {
    for (const entry of entries) {
        els.get(entry.target)?.(entry);
    }
});

export const useResize = <T extends Element>(
    onResize: (entry: ResizeObserverEntry & { target: T }) => void,
): React.RefObject<T> => {
    const ref = useRef<T>(null);

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const el = ref.current!;
        els.set(el, onResize as (entry: ResizeObserverEntry) => void);
        resizeObserver.observe(el);
        return () => {
            els.delete(el);
            resizeObserver.unobserve(el);
        };
    }, [ref.current]);

    return ref;
};
