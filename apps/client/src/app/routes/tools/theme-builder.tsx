import { ThemeBuilderPage } from "#/pages/theme-builder";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/tools/theme-builder")({
  component: ThemeBuilderPage,
});
