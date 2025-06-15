export interface Query {
  items: QueryItem[];
}

export type QueryItem = { type: "word"; value: string };

export const parseQuery = (query: string): Query => {
  if (query === "") return { items: [] };

  const items = query
    .split(/[\p{White_Space}]+/v)
    .filter(Boolean)
    .map<QueryItem>(word => ({ type: "word", value: word }));

  return { items };
};
