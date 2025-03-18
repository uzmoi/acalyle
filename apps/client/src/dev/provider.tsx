import { cx, style } from "@acalyle/css";
import { vars } from "@acalyle/ui";
import { defaultTheme } from "~/theme/default";
import { theme } from "../theme";
import { devAppTheme } from "./theme";

export const Provider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <div
      // TODO: テーマの参照の移行が終わったら消す
      style={devAppTheme}
      className={cx(
        defaultTheme,
        style({
          minHeight: "100%",
          fontFamily: vars.font.sans,
          color: theme("app-text"),
          backgroundColor: theme("app-bg"),
        }),
      )}
    >
      {children}
    </div>
  );
};
