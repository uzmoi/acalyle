import "react";
import "vite/client";

declare module "react" {
  interface CSSProperties {
    [x: `--${string}`]: string | number;
  }
}
