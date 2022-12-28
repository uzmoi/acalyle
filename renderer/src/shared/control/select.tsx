import { css, cx } from "@linaria/core";
import { ControlPartOutlineStyle, ControlPartResetStyle } from "./base";

export type SelectVariant = keyof typeof variantStyles;

export const Select: React.FC<
    {
        variant?: SelectVariant;
        onValueChange?: (value: string) => void;
    } & React.ComponentPropsWithoutRef<"select">
> & {
    Group: SelectOptionGroupComponent;
    Option: SelectOptionComponent;
} = ({
    variant = "outline",
    onChange,
    onValueChange,
    className,
    children,
    ...restProps
}) => {
    const handleChange =
        (onChange || onValueChange) &&
        ((e: React.ChangeEvent<HTMLSelectElement>) => {
            onChange?.(e);
            onValueChange?.(e.target.value);
        });

    return (
        <select
            {...restProps}
            onChange={handleChange}
            className={cx(
                ControlPartResetStyle,
                variantStyles[variant],
                SelectStyle,
                className,
            )}
        >
            {children}
        </select>
    );
};

const SelectStyle = css`
    /* - */
`;

const variantStyles = {
    outline: ControlPartOutlineStyle,
    unstyled: "",
} satisfies Record<string, string>;

type SelectOptionGroupComponent = React.FC<
    React.ComponentPropsWithoutRef<"optgroup">
>;
Select.Group = ({ className, ...restProps }) => {
    return (
        <optgroup {...restProps} className={cx(OptionGroupStyle, className)} />
    );
};

if (import.meta.env.DEV) {
    Select.Group.displayName = "Select.Group";
}

const OptionGroupStyle = css`
    /* - */
`;

type SelectOptionComponent = React.FC<React.ComponentPropsWithoutRef<"option">>;
Select.Option = ({ className, ...restProps }) => {
    return <option {...restProps} className={cx(OptionStyle, className)} />;
};

if (import.meta.env.DEV) {
    Select.Option.displayName = "Select.Option";
}

const OptionStyle = css`
    /* - */
`;
