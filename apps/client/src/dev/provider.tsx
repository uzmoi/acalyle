import { style } from "@acalyle/css";
import { vars } from "@acalyle/ui";
import { devAppTheme } from "./theme";

export const Provider: React.FC<{
    children: React.ReactNode;
}> = ({ children }) => {
    return (
        <div
            style={devAppTheme}
            className={style({
                minHeight: "100%",
                fontFamily: vars.font.sans,
                color: vars.color.fg.__,
                backgroundColor: vars.color.bg.app,
            })}
        >
            {children}
        </div>
    );
};
