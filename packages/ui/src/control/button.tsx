import { cx } from "@linaria/core";
import { style, styleVariants } from "@macaron-css/core";
import { vars } from "../theme";
import { ControlPartOutlineStyle, ControlPartResetStyle } from "./base";

export type ButtonVariant = keyof typeof variants;

export const Button: React.FC<
    {
        variant?: ButtonVariant;
    } & React.ComponentPropsWithoutRef<"button">
> = ({ variant = "outline", className, ...restProps }) => {
    return (
        <button
            type="button"
            {...restProps}
            className={cx(
                ControlPartResetStyle,
                style({
                    fontWeight: "bold",
                    cursor: "pointer",
                }),
                variants[variant],
                className,
            )}
        />
    );
};

const variants = styleVariants({
    outline: [ControlPartOutlineStyle],
    unstyled: [],
    icon: [
        ControlPartOutlineStyle,
        {
            padding: "0.25em",
            fontSize: "1.25em",
            lineHeight: 1,
        },
    ],
});
