import { cx } from "@linaria/core";
import { style, styleVariants } from "@macaron-css/core";
import { vars } from "../theme";
import { ControlPartOutlineStyle, ControlPartResetStyle } from "./base";

export type SelectVariant = keyof typeof variants;

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
            className={cx(ControlPartResetStyle, variants[variant], className)}
        >
            {children}
        </select>
    );
};

const variants = styleVariants({
    outline: [ControlPartOutlineStyle],
    unstyled: [],
});

type SelectOptionGroupComponent = React.FC<
    React.ComponentPropsWithoutRef<"optgroup">
>;
Select.Group = ({ ...restProps }) => {
    return <optgroup {...restProps} />;
};

if (import.meta.env.DEV) {
    Select.Group.displayName = "Select.Group";
}

type SelectOptionComponent = React.FC<React.ComponentPropsWithoutRef<"option">>;
Select.Option = ({ className, ...restProps }) => {
    return (
        <option
            {...restProps}
            className={cx(
                style({ backgroundColor: vars.color.bg3 }),
                className,
            )}
        />
    );
};

if (import.meta.env.DEV) {
    Select.Option.displayName = "Select.Option";
}
