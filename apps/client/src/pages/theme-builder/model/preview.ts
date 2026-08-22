export const PREVIEW_PAGES = ["note", "bool-shelf"] as const;

export type PreviewPage = (typeof PREVIEW_PAGES)[number];
