import { style } from "@macaron-css/core";
import { vars } from "../theme";
import { cx } from "./cx";

export const Alert: React.FC<
    {
        type: "error" | "warning" | "success";
    } & Omit<React.ComponentPropsWithoutRef<"div">, "role">
> = ({ type, className, ...restProps }) => {
    return (
        <div
            {...restProps}
            role="alert"
            data-alert={type}
            className={cx(
                style({
                    padding: "0.75em 1.25em",
                    border: "1px solid var(--alert-color)",
                    borderRadius: vars.radius.block,
                    selectors: {
                        '&[data-alert="error"]': {
                            vars: { "--alert-color": vars.color.denger },
                        },
                        '&[data-alert="warning"]': {
                            vars: { "--alert-color": vars.color.warning },
                        },
                        '&[data-alert="success"]': {
                            vars: { "--alert-color": vars.color.success },
                        },
                    },
                }),
                className,
            )}
        />
    );
};
