export type Stack<T> = {
    push(value: T): void;
    pop(): T | undefined;
    at(index: number): T | undefined;
    length: number;
};
