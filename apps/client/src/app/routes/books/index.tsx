/* eslint-disable pure-module/pure-module */

import {
  createFileRoute,
  useLoaderData,
  useSearch,
} from "@tanstack/react-router";
import * as v from "valibot";
import { BookListPage, fetchBooksPage } from "~/pages/book-list";

const RouteComponent: React.FC = () => {
  const { query } = useSearch({ from: Route.id });
  const { page } = useLoaderData({ from: Route.id });

  return <BookListPage initialQuery={query} fetchingPage={page} />;
};

export const Route = createFileRoute("/books/")({
  component: RouteComponent,
  validateSearch: v.object({
    query: v.optional(v.string()),
  }),
  loaderDeps({ search }) {
    return search;
  },
  loader({ deps }) {
    return { page: fetchBooksPage(deps.query ?? "") };
  },
});
