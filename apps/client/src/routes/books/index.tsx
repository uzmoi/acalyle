/* eslint-disable pure-module/pure-module */

import {
  createFileRoute,
  useLoaderData,
  useSearch,
} from "@tanstack/react-router";
import * as v from "valibot";
import { $bookConnection } from "~/entities/book";
import { BookListPage } from "~/pages/book-list";

const RouteComponent: React.FC = () => {
  const { query } = useSearch({ from: Route.id });
  const { connection } = useLoaderData({ from: Route.id });

  return <BookListPage initialQuery={query} connection={connection} />;
};

export const Route = createFileRoute("/books/")({
  component: RouteComponent,
  validateSearch: v.object({
    query: v.optional(v.string()),
  }),
  loaderDeps({ search }) {
    return search;
  },
  async loader({ deps }) {
    const connection = $bookConnection(deps.query ?? "");
    await connection.loadNextPage();
    return { connection };
  },
});
