import { AcalyleMemoTag } from "@acalyle/core";

class Filter<T> {
    include: T[] = [];
    exclude: T[] = [];
    to<U>(f: (include: T[] | undefined, exclude: T[] | undefined) => U): U {
        const nonEmpty = (a: T[]) => (a.length === 0 ? undefined : a);
        return f(nonEmpty(this.include), nonEmpty(this.exclude));
    }
}

export interface MemoFilters {
    contents: Filter<string>;
    tags: Filter<AcalyleMemoTag>;
}

export const parseSearchQuery = (query: string): MemoFilters => {
    const filters: MemoFilters = {
        contents: new Filter(),
        tags: new Filter(),
    };

    for (let searchPart of query.split(/\s+/)) {
        let key: keyof Filter<unknown> = "include";
        if (searchPart.startsWith("-")) {
            key = "exclude";
            searchPart = searchPart.slice(1);
        }
        const tag = AcalyleMemoTag.fromString(searchPart);
        // "#"が省略されたタグを弾いてcontentsとする
        if (tag != null && searchPart.startsWith(tag.symbol)) {
            filters.tags[key].push(tag);
        } else {
            filters.contents[key].push(searchPart);
        }
    }

    return filters;
};
