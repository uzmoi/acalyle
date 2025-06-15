export interface Query {
  items: QueryItem[];
}

export type QueryItem = { type: "word"; value: string };

export const parseQuery = (query: string): Query => {
  const items = query
    .match(/"(?:\\.|[^\\])*"(?!\P{White_Space})|\P{White_Space}+/gv)
    ?.map(word =>
      word.length >= 2 && word.startsWith('"') && word.endsWith('"') ?
        word.slice(1, -1).replaceAll(/\\(.)/gv, "$1")
      : word,
    )
    .filter(Boolean)
    .map<QueryItem>(word => ({ type: "word", value: word }));

  return { items: items ?? [] };
};
