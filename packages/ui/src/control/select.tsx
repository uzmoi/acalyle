import { cx, style } from "@acalyle/css";
import { vars } from "../theme";
import { base, reset } from "./base";

export const Select: React.FC<
    {
        unstyled?: boolean;
        onValueChange?: (value: string) => void;
    } & React.ComponentPropsWithoutRef<"select">
> & {
    Group: SelectOptionGroupComponent;
    Option: SelectOptionComponent;
} = ({
    unstyled,
    onChange,
    onValueChange,
    className,
    children,
    ...restProps
}) => {
    const handleChange =
        (onChange ?? onValueChange) &&
        ((e: React.ChangeEvent<HTMLSelectElement>) => {
            onChange?.(e);
            onValueChange?.(e.target.value);
        });

    return (
        <select
            {...restProps}
            onChange={handleChange}
            className={cx(reset, !unstyled && base, className)}
        >
            {children}
        </select>
    );
};

type SelectOptionGroupComponent = React.FC<
    React.ComponentPropsWithoutRef<"optgroup">
>;
// eslint-disable-next-line pure-module/pure-module
Select.Group = ({ ...restProps }) => {
    return <optgroup {...restProps} />;
};

if (import.meta.env.DEV) {
    // eslint-disable-next-line pure-module/pure-module
    Select.Group.displayName = "Select.Group";
}

type SelectOptionComponent = React.FC<React.ComponentPropsWithoutRef<"option">>;
// eslint-disable-next-line pure-module/pure-module
Select.Option = ({ className, ...restProps }) => {
    return (
        <option
            {...restProps}
            className={cx(
                style({ backgroundColor: vars.color.bg.block }),
                className,
            )}
        />
    );
};

if (import.meta.env.DEV) {
    // eslint-disable-next-line pure-module/pure-module
    Select.Option.displayName = "Select.Option";
}
