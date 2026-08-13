import preview from "#.storybook/preview";

import { ThemeBuilderPage } from "./page";

const meta = preview.meta({
  component: ThemeBuilderPage,
  parameters: { layout: "fullscreen" },
});

export const Default = meta.story({});
