import { cx } from "@acalyle/css";
import { TextInput, base } from "@acalyle/ui";
import { parseQuery } from "../model";

export const SearchBox: React.FC<{
  query: string;
  setQuery: (query: string) => void;
}> = ({ query, setQuery }) => {
  const { items } = parseQuery(query);

  return (
    <div className=":uno: relative">
      <TextInput type="search" value={query} onValueChange={setQuery} />
      <div
        className={cx(
          ":uno: pointer-events-none absolute inset-0 bg-transparent",
          base,
        )}
      >
        {items.map((item, i) => (
          <span key={i}>{item.value}</span>
        ))}
      </div>
    </div>
  );
};
