export const resolveResource = (path: string): URL =>
  new URL(path, `${location.origin}/api/`);
