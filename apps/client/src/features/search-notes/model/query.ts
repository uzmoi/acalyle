export interface Query {
  items: QueryItem[];
}

export type QueryItem =
  | {
      type: "word";
      start: number;
      end: number;
      exclude: boolean;
      value: string;
    }
  | {
      type: "tag";
      start: number;
      end: number;
      exclude: boolean;
      symbol: string;
      prop: string | null;
    }
  | { type: "ignore"; value: string };

const wsRe = /^\p{White_Space}/v;
const queryRe =
  /"(?:\\.|[^\\])*"(?!\P{White_Space})|\P{White_Space}+|\p{White_Space}+/gv;
const tagHeadRe = /^[!#$%&*+=?@^~]/;
const unescapeRe = /\\(.)/gv;

export const parseQuery = (query: string): Query => {
  const items = query
    .matchAll(queryRe)
    .map<QueryItem>(match => {
      let part = match[0];
      const start = match.index;
      const end = start + part.length;

      const exclude = part !== "-" && part.startsWith("-");
      if (exclude) {
        part = part.slice(1);
      }

      // quote
      if (part.length >= 2 && part.startsWith('"') && part.endsWith('"')) {
        const value = part.slice(1, -1).replaceAll(unescapeRe, "$1");

        return { type: "word", start, end, exclude, value };
      }

      // white space
      // eslint-disable-next-line @typescript-eslint/prefer-string-starts-ends-with
      if (wsRe.test(part)) {
        return { type: "ignore", value: part };
      }

      // tag
      if (tagHeadRe.test(part)) {
        const index = part.indexOf(":");
        return {
          type: "tag",
          start,
          end,
          exclude,
          symbol: index === -1 ? part : part.slice(0, index),
          prop: index === -1 ? null : part.slice(index + 1),
        };
      }

      return { type: "word", start, end, exclude, value: part };
    })
    .filter(item => item.type !== "word" || item.value !== "");

  return { items: [...items] };
};
