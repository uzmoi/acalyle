export type RemoveHead<
    S extends string,
    Head extends string,
> = S extends `${Head}${infer P}` ? P : S;

export type RemoveTail<
    S extends string,
    Tail extends string,
> = S extends `${infer P}${Tail}` ? P : S;
