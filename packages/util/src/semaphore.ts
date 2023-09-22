declare global {
    interface SymbolConstructor {
        readonly dispose: unique symbol;
    }
}

export class Semaphore {
    static mutex() {
        return new Semaphore(1);
    }
    constructor(private _count: number) {}
    get isLocked() {
        return this._count === 0;
    }
    private readonly _tasks: (() => void)[] = [];
    acquire(): Promise<{
        release: () => void;
        [Symbol.dispose](): void;
    }> {
        return new Promise(resolve => {
            const task = () => {
                this._count--;
                let processing = true;
                const release = () => {
                    // release
                    if (processing) {
                        processing = false;
                        this._count++;
                        // run next task
                        this._tasks.shift()?.();
                    }
                };
                resolve({ release, [Symbol.dispose]: release });
            };
            if (this.isLocked) {
                this._tasks.push(task);
            } else {
                task();
            }
        });
    }
    async use<T>(f: () => Promise<T>): Promise<T> {
        const { release } = await this.acquire();
        try {
            return await f();
        } finally {
            release();
        }
    }
}
