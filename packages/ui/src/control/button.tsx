import { css, cx } from "@linaria/core";
import { vars } from "../theme";
import { ControlPartOutlineStyle, ControlPartResetStyle } from "./base";

export type ButtonVariant = keyof typeof variantStyles;

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
                ButtonStyle,
                variantStyles[variant],
                className,
            )}
        />
    );
};

const ButtonStyle = css`
    font-weight: bold;
    cursor: pointer;
`;

const variantStyles = {
    outline: ControlPartOutlineStyle,
    unstyled: "",
    icon: cx(
        ControlPartOutlineStyle,
        css`
            padding: 0.25em;
            font-size: 1.25em;
            line-height: 1;
            svg {
                vertical-align: top;
            }
        `,
    ),
} satisfies Record<string, string>;
