import { css, cx } from "@linaria/core";
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
    inline: "",
}; // TODO: satisfies Record<string, string>;
