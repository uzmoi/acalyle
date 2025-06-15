export interface Query {
  items: QueryItem[];
}

export type QueryItem = { type: "word"; value: string };

export const parseQuery = (query: string): Query => {
  const items = query
    .match(/"(?:\\.|[^\\])*"(?!\P{White_Space})|\P{White_Space}+/gv)
    ?.map<QueryItem>(part => {
      // quote
      if (part.length >= 2 && part.startsWith('"') && part.endsWith('"')) {
        const value = part.slice(1, -1).replaceAll(/\\(.)/gv, "$1");

        return { type: "word", value };
      }

      return { type: "word", value: part };
    })
    .filter(item => item.value !== "");

  return { items: items ?? [] };
};
