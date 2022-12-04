export type WindowEventHandler<T extends keyof WindowEventMap> = (
    this: Window,
    ev: WindowEventMap[T],
) => void;

export class WindowEvent<T extends keyof WindowEventMap> {
    static handlers = new Map<string, WindowEvent<keyof WindowEventMap>>();
    static on<T extends keyof WindowEventMap>(
        type: T,
        listener: (this: Window, ev: WindowEventMap[T]) => void,
        // options?: AddEventListenerOptions,
    ) {
        let e = WindowEvent.handlers.get(type) as WindowEvent<T> | undefined;
        if (e == null) {
            e = new WindowEvent(type);
            WindowEvent.handlers.set(
                type,
                e as unknown as WindowEvent<keyof WindowEventMap>,
            );
        }
        return e.on(listener);
    }
    private readonly handlers = new Set<WindowEventHandler<T>>();
    private constructor(type: T) {
        window.addEventListener(type, e => {
            this.handlers.forEach(f => {
                f.call(window, e);
            });
        });
    }
    private on(listener: WindowEventHandler<T>) {
        this.handlers.add(listener);
        return () => {
            this.handlers.delete(listener);
        };
    }
}
