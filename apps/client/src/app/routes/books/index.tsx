/* eslint-disable pure-module/pure-module */

import {
  createFileRoute,
  useLoaderData,
  useSearch,
} from "@tanstack/react-router";
import * as v from "valibot";
import type { Cursor } from "#shared/graphql";
import { BookListPage, fetchBooksPage } from "~/pages/book-list";

const RouteComponent: React.FC = () => {
  const { query } = useSearch({ from: Route.id });
  const { fetchingPage } = useLoaderData({ from: Route.id });

  return <BookListPage initialQuery={query} fetchingPage={fetchingPage} />;
};

export const Route = createFileRoute("/books/")({
  component: RouteComponent,
  validateSearch: v.object({
    query: v.optional(v.string()),
    after: v.optional(v.string()),
    before: v.optional(v.string()),
  }),
  loaderDeps({ search }) {
    return search;
  },
  loader({ deps }) {
    let dir: "forward" | "backward" = "forward";
    let cursor = (deps.after ?? null) as Cursor | null;

    if (deps.before) {
      cursor = deps.before as Cursor;
      dir = "backward";
    }

    const fetchingPage = fetchBooksPage(deps.query ?? "", cursor, dir);
    return { fetchingPage };
  },
});
