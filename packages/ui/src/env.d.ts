import "vite/client";
import "react";

declare module "react" {
    interface CSSProperties {
        [x: `--${string}`]: string | number;
    }
}
