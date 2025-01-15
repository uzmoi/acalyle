import { cx, style } from "@acalyle/css";
import { vars } from "@acalyle/ui";
import { QuickModalContainer } from "~/modal/container";
import { PageRoot } from "~/pages/Root";
import { theme } from "~/theme";
import { defaultTheme } from "~/theme/default";

export const App: React.FC = () => {
    return (
        <div
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
            <PageRoot />
            <QuickModalContainer />
        </div>
    );
};
