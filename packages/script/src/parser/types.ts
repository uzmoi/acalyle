export type Expression =
    | { type: "Bool"; value: boolean }
    | { type: "Ident"; name: string };
