export interface QueryToken {
  type: "op" | "word" | "word:quoted" | "tag" | "ignore";
  content: string;
}

const queryRe =
  /-?('(?:\\.|[^\\'])*'|"(?:\\.|[^\\"])*")(?!\P{White_Space})|\P{White_Space}+/gv;

const tagHeadRe = /^[!#$%&*+=?@^~]/;

export const lexQuery = function* (query: string): Generator<QueryToken, void> {
  let ignoreStartIndex = 0;

  for (const match of query.matchAll(queryRe)) {
    let content = match[0];
    let pos = match.index;

    if (ignoreStartIndex !== pos) {
      yield { type: "ignore", content: query.slice(ignoreStartIndex, pos) };
    }

    if (content !== "-" && content.startsWith("-")) {
      yield { type: "op", content: "-" };
      pos++;
      content = content.slice(1);
    }

    const isQuoted = match[1] != null;

    const type =
      isQuoted ? "word:quoted"
      : tagHeadRe.test(content) ? "tag"
      : "word";

    yield { type, content };

    ignoreStartIndex = pos + content.length;
  }

  if (ignoreStartIndex !== query.length) {
    yield { type: "ignore", content: query.slice(ignoreStartIndex) };
  }
};

export type QueryItem =
  | {
      type: "word";
      exclude: boolean;
      value: string;
    }
  | {
      type: "tag";
      exclude: boolean;
      symbol: string;
      prop: string | null;
    };

const unescapeRe = /\\(.)/gv;

export const parseQuery = function* (
  query: string,
): Generator<QueryItem, void> {
  let exclude = false;

  for (const { type, content } of lexQuery(query)) {
    if (type === "op") {
      exclude = true;
      continue;
    }

    switch (type) {
      case "tag": {
        const index = content.indexOf(":");
        const symbol = index === -1 ? content : content.slice(0, index);
        const prop = index === -1 ? null : content.slice(index + 1);
        yield { type: "tag", exclude, symbol, prop };
        break;
      }
      case "word": {
        yield { type: "word", exclude, value: content };
        break;
      }
      case "word:quoted": {
        const value = content.slice(1, -1).replaceAll(unescapeRe, "$1");
        yield { type: "word", exclude, value };
        break;
      }
      default:
    }

    exclude = false;
  }
};

const printServerQueryItem = (item: QueryItem): string => {
  switch (item.type) {
    case "word": {
      return `"${item.value.replaceAll(/[\s":\\]/g, "\\$&")}"`;
    }
    case "tag": {
      return item.symbol + (item.prop == null ? "" : `:${item.prop}`);
    }
    // No Default: Returned in all cases.
  }
};

export const printServerQuery = (query: readonly QueryItem[]): string =>
  query
    .map(item => (item.exclude ? "-" : "") + printServerQueryItem(item))
    .join(" ");
