export type Stack<T> = {
    push(...values: T[]): void;
    pop(): T | undefined;
    at(index: number): T | undefined;
    length: number;
};
