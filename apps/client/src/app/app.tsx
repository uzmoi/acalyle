import { cx, style } from "@acalyle/css";
import { vars } from "@acalyle/ui";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { QuickModalContainer } from "~/modal/container";
import { PageRoot } from "~/pages/Root";
import { routeTree } from "~/routeTree.gen";
import { theme } from "~/theme";
import { defaultTheme } from "~/theme/default";

const router = /* #__PURE__ */ createRouter({
    routeTree,
    defaultPreload: "intent",
});

declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router;
    }
}

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
            <RouterProvider router={router} />
            <PageRoot />
            <QuickModalContainer />
        </div>
    );
};
