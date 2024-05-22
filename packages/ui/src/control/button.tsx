import { cx, style } from "@acalyle/css";
import { vars } from "../theme";
import { type ControlPartVariant, control } from "./base";

export const Button: React.FC<
    {
        variant?: ControlPartVariant;
    } & React.ComponentPropsWithoutRef<"button">
> = ({ variant = "solid", className, ...restProps }) => {
    return (
        <button
            type="button"
            {...restProps}
            className={cx(
                control.reset,
                control.base,
                control[variant],
                style({
                    fontWeight: "bold",
                    cursor: "pointer",
                    "&:disabled": {
                        color: vars.color.fg.mute,
                        cursor: "not-allowed",
                    },
                }),
                className,
            )}
        />
    );
};
