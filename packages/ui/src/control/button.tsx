import { style, styleVariants } from "@macaron-css/core";
import { cx } from "../base/cx";
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
                    ":disabled": {
                        color: vars.color.fg.mute,
                        cursor: "not-allowed",
                    },
                }),
                variants[variant],
                className,
            )}
        />
    );
};

const variants = styleVariants({
    outline: [
        ControlPartOutlineStyle,
        { backgroundColor: vars.color.bg.inline },
    ],
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
