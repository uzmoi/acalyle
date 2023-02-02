import { useEffect, useRef } from "react";

export const Intersection: React.FC<
    {
        onIntersection: (entry: IntersectionObserverEntry) => void;
    } & IntersectionObserverInit &
        React.ComponentPropsWithoutRef<"div">
> = ({ onIntersection, root, rootMargin, threshold, ...restProps }) => {
    const el = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (el.current == null) return;

        const observer = new IntersectionObserver(
            entries => {
                for (const entry of entries) {
                    onIntersection(entry);
                }
            },
            { root, rootMargin, threshold },
        );

        observer.observe(el.current);
        return () => {
            observer.disconnect();
        };
    }, [el, onIntersection, root, rootMargin, threshold]);

    return <div ref={el} {...restProps} />;
};
