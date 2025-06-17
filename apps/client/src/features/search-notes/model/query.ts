export interface Query {
  items: QueryItem[];
}

export type QueryItem = { type: "word"; value: string };

const queryRe = /"(?:\\.|[^\\])*"(?!\P{White_Space})|\P{White_Space}+/gv;
const unescapeRe = /\\(.)/gv;

export const parseQuery = (query: string): Query => {
  const items = query
    .match(queryRe)
    ?.map<QueryItem>(part => {
      // quote
      if (part.length >= 2 && part.startsWith('"') && part.endsWith('"')) {
        const value = part.slice(1, -1).replaceAll(unescapeRe, "$1");

        return { type: "word", value };
      }

      return { type: "word", value: part };
    })
    .filter(item => item.value !== "");

  return { items: items ?? [] };
};
