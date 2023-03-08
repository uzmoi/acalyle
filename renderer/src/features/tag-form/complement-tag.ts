// cspell:word damerau

import { AcalyleMemoTag } from "@acalyle/core";
import { assert } from "emnorst";
import { damerauLevenshtein } from "./damerau-levenshtein";

const matchPart = (
    bookTagPart: string,
    inputTagPart: string,
): number | undefined => {
    if (bookTagPart === inputTagPart) {
        return 0;
    }
    if (bookTagPart.startsWith(inputTagPart)) {
        return 1;
    }
    if (bookTagPart.includes(inputTagPart)) {
        return 2;
    }

    const d = damerauLevenshtein(bookTagPart, inputTagPart);
    if (d.similarity > 0.8 || d.steps < 3) {
        return d.steps + 2;
    }
};

const eqArray = (xs: readonly unknown[], ys: readonly unknown[]) => {
    return xs.length == ys.length && xs.every((name, i) => name === ys[i]);
};

export const complementTagSymbol = (
    bookTagSymbols: readonly string[],
    input: string,
): readonly string[] => {
    const inputTag = AcalyleMemoTag.parse(input);

    const complementTags = new Map<string, number>();

    const inputPath = inputTag.path.filter(
        (name, i) => name !== "" || i === inputTag.path.length - 1,
    );
    const bookTags = bookTagSymbols.map(AcalyleMemoTag.parse);

    const sameTypeBookTags = inputTag.hasHead
        ? bookTags.filter(bookTag => bookTag.head === inputTag.head)
        : bookTags;

    for (const bookTag of sameTypeBookTags) {
        const lim = bookTag.path.length - inputPath.length;
        for (let offset = -1; offset < lim; offset++) {
            if (
                !eqArray(
                    inputPath.slice(0, -1),
                    bookTag.path.slice(offset + 1, inputPath.length + offset),
                )
            ) {
                continue;
            }
            const bookTagPart = bookTag.path[inputPath.length + offset];
            const inputTagPart = inputPath.at(-1);
            assert.nonNullable(bookTagPart);
            assert.nonNullable(inputTagPart);

            const match = matchPart(bookTagPart, inputTagPart);
            if (match != null) {
                complementTags.set(bookTag.tagString, match + offset * 10);
                break;
            }
        }
    }

    return Array.from(complementTags)
        .sort(([, a], [, b]) => a - b)
        .map(([symbol]) => symbol);
};
