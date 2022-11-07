// eslint-disable-next-line import/no-extraneous-dependencies
import { MemoTag } from "renderer/src/entities/tag/lib/memo-tag";

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
    tags: Filter<MemoTag>;
}

export const parseSearchQuery = (query: string): MemoFilters => {
    const filters: MemoFilters = {
        contents: new Filter(),
        tags: new Filter(),
    };

    for (let searchPart of query.split(/\s+/)) {
        let isExclude: keyof Filter<unknown> = "include";
        if (searchPart.startsWith("-")) {
            isExclude = "exclude";
            searchPart = searchPart.slice(1);
        }
        const tag = MemoTag.fromString(searchPart);
        if (tag != null && !searchPart.startsWith(tag.name[0])) {
            filters.tags[isExclude].push(tag);
        } else {
            filters.contents[isExclude].push(searchPart);
        }
    }

    return filters;
};
