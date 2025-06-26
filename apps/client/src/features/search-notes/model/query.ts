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
      quoted: boolean;
    }
  | {
      type: "tag";
      start: number;
      end: number;
      exclude: boolean;
      symbol: string;
      prop: string | null;
    };

const queryRe =
  /-?('(?:\\.|[^\\'])*'|"(?:\\.|[^\\"])*")(?!\P{White_Space})|\P{White_Space}+/gv;
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

      // quoted
      if (match[1] != null) {
        const value = part.slice(1, -1).replaceAll(unescapeRe, "$1");

        return { type: "word", start, end, exclude, value, quoted: true };
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

      return { type: "word", start, end, exclude, value: part, quoted: false };
    })
    .filter(item => item.type !== "word" || item.value !== "");

  return { items: [...items] };
};
