import preview from "#.storybook/preview";

import { ThemeBuilderPage } from "./page";

const meta = preview.meta({
  title: "pages/theme-builder",
  component: ThemeBuilderPage,
  parameters: { layout: "fullscreen" },
});

export const Default = meta.story({});
