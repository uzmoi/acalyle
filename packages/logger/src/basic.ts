import type { JsonValue, ValueOf } from "emnorst";
import { type Log, Logger } from "./base";

export const BasicLogLevel = {
    trace: 0,
    debug: 1,
    info: 2,
    warn: 3,
    error: 4,
    fatal: 5,
} as const;

export type BasicLogLevel = ValueOf<typeof BasicLogLevel>;

export class BasicLogger<in M = JsonValue> extends Logger<
    readonly M[],
    BasicLogLevel
> {
    child(name: string): BasicLogger<M> {
        const child = new BasicLogger<M>(`${this.name}.${name}`);
        child.attachTransport(this);
        return child;
    }
    mapChild<N>(name: string, f: (message: N) => M): BasicLogger<N> {
        const child = new BasicLogger<N>(`${this.name}.${name}`);
        const transport = (log: Log<readonly N[], BasicLogLevel>) => {
            this.log(log.level, log.message.map(f), log);
        };
        child.attachTransport({ transport });
        return child;
    }
    trace(...messages: M[]): void {
        this.log(BasicLogLevel.trace, messages);
    }
    debug(...messages: M[]): void {
        this.log(BasicLogLevel.debug, messages);
    }
    info(...messages: M[]): void {
        this.log(BasicLogLevel.info, messages);
    }
    warn(...messages: M[]): void {
        this.log(BasicLogLevel.warn, messages);
    }
    error(...messages: M[]): void {
        this.log(BasicLogLevel.error, messages);
    }
    fatal(...messages: M[]): void {
        this.log(BasicLogLevel.fatal, messages);
    }
}
