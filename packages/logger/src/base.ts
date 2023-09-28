export interface Log<out M, out L, out MetaData = undefined> {
    name: string;
    level: L;
    timeStamp: number;
    message: M;
    meta: MetaData | undefined;
}

export interface Transport<in M, in L, in MetaData = undefined> {
    transport(log: Log<M, L, MetaData>): void;
}

export abstract class Logger<in Message, in Level, in MetaData = undefined>
    implements Transport<Message, Level, MetaData>
{
    constructor(protected readonly name: string) {}
    private readonly _transports = new Set<
        Transport<Message, Level, MetaData>
    >();
    attachTransport(transport: Transport<Message, Level, MetaData>): void {
        this._transports.add(transport);
    }
    detachTransport(transport: Transport<Message, Level, MetaData>): void {
        this._transports.delete(transport);
    }
    transport(log: Log<Message, Level, MetaData>): void {
        for (const transport of this._transports) {
            transport.transport(log);
        }
    }
    protected log(
        level: Level,
        message: Message,
        options?: Partial<
            Omit<Log<Message, Level, MetaData>, "level" | "message">
        >,
    ): void {
        const {
            meta,
            timeStamp = Date.now(),
            name = this.name,
        } = options ?? {};
        this.transport({ name, level, timeStamp, message, meta });
    }
}
