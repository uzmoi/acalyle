import { style, styleVariants } from "@macaron-css/core";
import { cx } from "../base/cx";
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

if (process.env.NODE_ENV === "development") {
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

if (process.env.NODE_ENV === "development") {
    Select.Option.displayName = "Select.Option";
}
